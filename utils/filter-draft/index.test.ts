import { describe, expect, it } from 'vitest'
import { normalizeFilterDraft, normalizeGemNames } from '.'

describe('normalizeGemNames', () => {
  it('migrates legacy text lists and removes case-insensitive duplicates', () => {
    expect(normalizeGemNames(' Return, Chain\nreturn\n  ')).toEqual([
      'Return',
      'Chain',
    ])
  })

  it('normalizes array values used by the multi-select', () => {
    expect(normalizeGemNames([' Return ', '', 'Chain', 'chain'])).toEqual([
      'Return',
      'Chain',
    ])
  })
})

describe('normalizeFilterDraft', () => {
  it('preserves a legacy draft while migrating support strings to arrays', () => {
    expect(normalizeFilterDraft({
      hideFailures: true,
      mercenaryClass: 'Stormhand',
      requirements: [{
        id: 'requirement-1',
        optionalSupports: 'Chain',
        requiredSupports: 'Return\nGreater Multiple Projectiles',
        skill: 'Kinetic Blast of Clustering',
      }],
    })).toEqual({
      hideFailures: true,
      mercenaryClass: 'Stormhand',
      requirements: [{
        id: 'requirement-1',
        optionalSupports: ['Chain'],
        requiredSupports: ['Return', 'Greater Multiple Projectiles'],
        skill: 'Kinetic Blast of Clustering',
      }],
    })
  })

  it('creates an editable requirement for malformed drafts', () => {
    const normalizedDraft = normalizeFilterDraft(null)

    expect(normalizedDraft).toMatchObject({
      hideFailures: false,
      mercenaryClass: '',
    })
    expect(normalizedDraft.requirements).toHaveLength(1)
    expect(normalizedDraft.requirements[0]).toMatchObject({
      optionalSupports: [],
      requiredSupports: [],
      skill: '',
    })
  })
})
