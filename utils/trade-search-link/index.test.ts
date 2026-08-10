import type { FilterConfig } from '@/utils/filter-config/types'
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
  it('creates a one-entry mercenary group for a skill without supports', () => {
    const request = createTradeSearchRequest(createFilter([{
      skill: 'Shield Crush',
      requiredSupports: [],
      optionalSupports: ['Chain'],
    }]))

    expect(request).toMatchObject({
      query: {
        status: { option: 'securable' },
        stats: [{
          type: 'mercenary',
          value: { min: 1 },
          filters: [{ id: expect.stringMatching(/^mercenary\.skill_/) }],
        }],
      },
      sort: { price: 'asc' },
    })
    expect(JSON.stringify(request)).not.toContain('Chain')
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

    expect(request.query.stats).toHaveLength(2)
    expect(request.query.stats[0]!.value.min).toBe(3)
    expect(request.query.stats[0]!.filters).toHaveLength(3)
    expect(request.query.stats[1]!.value.min).toBe(2)
    expect(request.query.stats[1]!.filters).toHaveLength(2)
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
      credentials: 'same-origin',
    })
  })

  it.each([
    [429, 'rate limiting searches'],
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
