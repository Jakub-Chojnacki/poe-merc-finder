import type { FilterConfig } from '@/features/mercenary-filter/model/filter-config/types'
import { describe, expect, it, vi } from 'vitest'
import {
  createTradeSearchRequest,
  createTradeSearchUrl,
  generateTradeSearchLink,
  getTradeSearchContext,
  TradeSearchLinkError,
} from '.'

function createFilter(
  requirements: FilterConfig['requirements'],
): FilterConfig {
  return {
    requirements,
    hideFailures: true,
  }
}

describe('trade search request', () => {
  it('creates a standard and group for a skill without required supports', () => {
    const request = createTradeSearchRequest(createFilter([{
      skill: 'Shield Crush',
      requiredSupports: [],
      optionalSupports: ['Chain'],
    }]))

    expect(request).toMatchObject({
      query: {
        status: { option: 'securable' },
        stats: [{
          type: 'and',
          filters: [{ id: expect.stringMatching(/^mercenary\.skill_/) }],
        }],
      },
      sort: { price: 'asc' },
    })
    expect(JSON.stringify(request)).not.toContain('Chain')
  })

  it('combines all skills without required supports into one and group', () => {
    const request = createTradeSearchRequest(createFilter([
      {
        skill: 'Elemental Hit of Ice',
        requiredSupports: ['Added Cold'],
        optionalSupports: [],
      },
      {
        skill: 'Herald of Ice',
        requiredSupports: [],
        optionalSupports: [],
      },
      {
        skill: 'Wild Strike',
        requiredSupports: ['Chain'],
        optionalSupports: [],
      },
      {
        skill: 'Purity of Ice',
        requiredSupports: [],
        optionalSupports: [],
      },
      {
        skill: 'Dash',
        requiredSupports: [],
        optionalSupports: [],
      },
    ]))

    expect(request.query.stats).toHaveLength(3)
    expect(request.query.stats[0]).toMatchObject({
      type: 'and',
      filters: [
        { id: expect.stringMatching(/^mercenary\.skill_/) },
        { id: expect.stringMatching(/^mercenary\.skill_/) },
        { id: expect.stringMatching(/^mercenary\.skill_/) },
      ],
    })
    expect(request.query.stats.slice(1)).toMatchObject([
      {
        type: 'mercenary',
        value: { min: 2 },
      },
      {
        type: 'mercenary',
        value: { min: 2 },
      },
    ])
  })

  it('creates independent groups that require every required entry', () => {
    const request = createTradeSearchRequest(createFilter([
      {
        skill: 'Shield Crush',
        requiredSupports: ['Return', 'Chain'],
        optionalSupports: ['Multiple Projectiles'],
      },
      {
        skill: 'Holy Relic',
        requiredSupports: ['Minion Life'],
        optionalSupports: [],
      },
    ]))

    expect(request.query.stats).toMatchObject([
      {
        type: 'mercenary',
        value: { min: 3 },
        filters: [{}, {}, {}],
      },
      {
        type: 'mercenary',
        value: { min: 2 },
        filters: [{}, {}],
      },
    ])
    expect(JSON.stringify(request)).not.toContain('Multiple Projectiles')
  })

  it('reports all unknown required trade stats before making a request', () => {
    expect(() => createTradeSearchRequest(createFilter([{
      skill: 'Unknown Skill',
      requiredSupports: ['Unknown Support'],
      optionalSupports: [],
    }]))).toThrowError(
      'No Path of Exile trade stat was found for: Unknown Skill, Unknown Support.',
    )
  })

  it('rejects an empty configuration', () => {
    expect(() => createTradeSearchRequest(createFilter([])))
      .toThrow(TradeSearchLinkError)
  })
})

describe('trade search URLs', () => {
  it('extracts league and query ID and constructs canonical URLs', () => {
    expect(getTradeSearchContext(
      'https://www.pathofexile.com/trade/search/Hardcore%20Trade/abc123',
    )).toEqual({
      league: 'Hardcore Trade',
      queryId: 'abc123',
    })
    expect(createTradeSearchUrl(
      'https://www.pathofexile.com',
      'Hardcore Trade',
      'new-id',
    )).toBe(
      'https://www.pathofexile.com/trade/search/Hardcore%20Trade/new-id',
    )
  })

  it('rejects pages outside a league trade search', () => {
    expect(() => getTradeSearchContext('https://www.pathofexile.com/trade'))
      .toThrow('Open a Path of Exile trade search')
  })

  it('posts the minimal query and returns the generated URL', async () => {
    const fetchSearch = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ id: 'generated123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await generateTradeSearchLink(createFilter([{
      skill: 'Shield Crush',
      requiredSupports: ['Return'],
      optionalSupports: [],
    }]), {
      fetch: fetchSearch,
      pageUrl: 'https://www.pathofexile.com/trade/search/Allflame/current',
    })

    expect(result).toEqual({
      league: 'Allflame',
      queryId: 'generated123',
      url: 'https://www.pathofexile.com/trade/search/Allflame/generated123',
    })
    expect(fetchSearch).toHaveBeenCalledOnce()
    expect(String(fetchSearch.mock.calls[0]![0])).toBe(
      'https://www.pathofexile.com/api/trade/search/Allflame',
    )
    expect(fetchSearch.mock.calls[0]![1]).toMatchObject({
      method: 'POST',
      credentials: 'include',
    })
  })

  it('explains how to resolve a query-complexity error', async () => {
    const fetchSearch = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({
        error: {
          code: 2,
          message: 'Query is too complex. Please reduce the amount of filters used.\nLogging in will increase this limit.',
        },
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(generateTradeSearchLink(createFilter([{
      skill: 'Shield Crush',
      requiredSupports: ['Return'],
      optionalSupports: [],
    }]), {
      fetch: fetchSearch,
      pageUrl: 'https://www.pathofexile.com/trade/search/Allflame/current',
    })).rejects.toThrow(
      'Log in to Path of Exile and try again, or remove some skill or support filters',
    )
  })

  it.each([
    [429, 'rate limiting searches'],
    [400, 'could not generate'],
    [500, 'could not generate'],
  ])('provides a readable error for HTTP %s', async (status, message) => {
    const fetchSearch = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(null, { status }),
    )

    await expect(generateTradeSearchLink(createFilter([{
      skill: 'Shield Crush',
      requiredSupports: [],
      optionalSupports: [],
    }]), {
      fetch: fetchSearch,
      pageUrl: 'https://www.pathofexile.com/trade/search/Allflame/current',
    })).rejects.toThrow(message)
  })

  it('rejects malformed successful responses', async () => {
    const fetchSearch = vi.fn<typeof fetch>().mockResolvedValue(
      new Response('{}', { status: 200 }),
    )

    await expect(generateTradeSearchLink(createFilter([{
      skill: 'Shield Crush',
      requiredSupports: [],
      optionalSupports: [],
    }]), {
      fetch: fetchSearch,
      pageUrl: 'https://www.pathofexile.com/trade/search/Allflame/current',
    })).rejects.toThrow('invalid search response')
  })
})
