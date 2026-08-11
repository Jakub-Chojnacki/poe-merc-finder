import { describe, expect, it } from 'vitest'
import { parseMercenaryWarrant } from '.'

const EXAMPLE_WARRANT = `Item Class: Map Fragments
Rarity: Normal
Mercenary Warrant
--------
Saxon, the Azadin Seadog
--------
Build: Mysterious Diver
Mercenary Level: 83
--------
Elemental Hit of Ice
Added Cold (Tier: 2)
Cold Penetration (Tier: 2)
Greater Critical Chance (Tier: 3)
Multistrike (Tier: 2)
Greater Critical Damage (Tier: 3)
--------
Frost Bomb
Increased Area of Effect (Tier: 2)
Lesser Spell Cascade (Tier: 1)
--------
Herald of Ice
--------
Wild Strike
Cold Penetration (Tier: 2)
Multistrike (Tier: 2)
Added Cold (Tier: 2)
Chain (Tier: 2)
Greater Multiple Projectiles (Tier: 3)
--------
Purity of Ice
--------
Dash
--------
Right click this item to view Mercenary details.
Can be used in a personal Map Device alongside a Map to have this previously fought Mercenary reappear in the area for a rematch.`

describe('parseMercenaryWarrant', () => {
  it('turns every gem group into a required filter group', () => {
    const result = parseMercenaryWarrant(EXAMPLE_WARRANT)

    expect(result.mercenaryClass).toBe('Mysterious Diver')
    expect(result.requirements.map(({ id: _id, ...requirement }) => (
      requirement
    ))).toEqual([
      {
        skill: 'Elemental Hit of Ice',
        requiredSupports: [
          'Added Cold',
          'Cold Penetration',
          'Greater Critical Chance',
          'Multistrike',
          'Greater Critical Damage',
        ],
        optionalSupports: [],
      },
      {
        skill: 'Frost Bomb',
        requiredSupports: [
          'Increased Area of Effect',
          'Lesser Spell Cascade',
        ],
        optionalSupports: [],
      },
      {
        skill: 'Herald of Ice',
        requiredSupports: [],
        optionalSupports: [],
      },
      {
        skill: 'Wild Strike',
        requiredSupports: [
          'Cold Penetration',
          'Multistrike',
          'Added Cold',
          'Chain',
          'Greater Multiple Projectiles',
        ],
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
    ])
  })

  it('accepts Windows line endings and case differences in known names', () => {
    const result = parseMercenaryWarrant(
      EXAMPLE_WARRANT
        .replace('Mysterious Diver', 'mysterious diver')
        .replace('Added Cold', 'added cold')
        .replace(/\n/g, '\r\n'),
    )

    expect(result.mercenaryClass).toBe('Mysterious Diver')
    expect(result.requirements[0]?.requiredSupports[0]).toBe('Added Cold')
  })

  it('rejects text that is not a warrant', () => {
    expect(() => parseMercenaryWarrant('Elemental Hit of Ice'))
      .toThrow('does not look like a copied Mercenary Warrant')
  })

  it('reports an unknown mercenary build', () => {
    expect(() => parseMercenaryWarrant(
      EXAMPLE_WARRANT.replace('Mysterious Diver', 'Unknown Build'),
    )).toThrow('mercenary build “Unknown Build” is not supported yet')
  })
})
