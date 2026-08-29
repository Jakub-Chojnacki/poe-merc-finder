import { describe, expect, it } from 'vitest'
import { createFilterConfig } from '.'

describe('filter config', () => {
  it('trims entries, removes exact duplicates, and ignores blank skills', () => {
    const filter = createFilterConfig({
      mercenaryClass: 'Bastion',
      hideFailures: true,
      requirements: [
        {
          id: 'one',
          skill: '  Shield Crush  ',
          requiredSupports: ['Return', 'Chain', 'Return'],
          optionalSupports: ['Multiple Projectiles', 'Chain'],
        },
        {
          id: 'two',
          skill: '   ',
          requiredSupports: ['Return'],
          optionalSupports: [],
        },
      ],
    })

    expect(filter).toEqual({
      hideFailures: true,
      requirements: [{
        skill: 'Shield Crush',
        requiredSupports: ['Return', 'Chain'],
        optionalSupports: ['Multiple Projectiles', 'Chain'],
      }],
    })
  })
})
