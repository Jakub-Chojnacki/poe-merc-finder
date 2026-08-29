import { describe, expect, it } from 'vitest'
import {
  getMercenarySkillOptions,
  getMercenarySkillTradeStatId,
  getMercenarySupportOptions,
  getMercenarySupportTradeStatId,
  normalizeMercenarySkillName,
} from '.'
import { ALL_SKILL_OPTIONS, MERCENARY_OPTIONS } from './const'

describe('mercenary skill options', () => {
  it('limits skills to the selected mercenary class', () => {
    const options = getMercenarySkillOptions('Earthshaker')
    const names = options.map(option => option.name)

    expect(names).toContain('Tectonic Cascade')
    expect(names).not.toContain('Kinetic Blast of Clustering')
  })

  it('includes the matching bundled house crest for every mercenary class', () => {
    expect(MERCENARY_OPTIONS.find(option => option.name === 'Earthshaker'))
      .toMatchObject({
        house: 'Keita',
        iconPath: '/icons/houses/keita.png',
      })
    expect(MERCENARY_OPTIONS.find(option => option.name === 'Kineticist'))
      .toMatchObject({
        house: 'Bardiya',
        iconPath: '/icons/houses/bardiya.png',
      })
    expect(MERCENARY_OPTIONS.find(option => option.name === 'Flamequiver'))
      .toMatchObject({ house: 'Cyaxan' })
    expect(MERCENARY_OPTIONS.find(option => option.name === 'Bastion'))
      .toMatchObject({ house: 'Azadi' })
    expect(MERCENARY_OPTIONS.every(option => option.iconPath)).toBe(true)
  })

  it('only includes skills assigned to a mercenary in the unfiltered list', () => {
    const names = ALL_SKILL_OPTIONS.map(option => option.name)

    expect(names).toContain('Storm Call')
    expect(names).not.toContain('Stormcall')
    expect(names).not.toContain('Lightning Warp Trap')
  })

  it('limits supports to those compatible with the selected skill', () => {
    const supports = getMercenarySupportOptions('Kinetic Bolt')

    expect(supports).toContain('Greater Multiple Projectiles')
    expect(supports).toContain('Lesser Faster Attacks')
    expect(supports).not.toContain('Melee Splash')
  })
})

describe('mercenary trade stat resolution', () => {
  it('resolves skill and support names case-insensitively', () => {
    expect(getMercenarySkillTradeStatId('  shield CRUSH '))
      .toMatch(/^mercenary\.skill_/)
    expect(getMercenarySupportTradeStatId(' return '))
      .toMatch(/^mercenary\.support_/)
  })

  it('resolves saved wiki names to their current trade skill', () => {
    expect(getMercenarySkillTradeStatId('Storm Call'))
      .toBe(getMercenarySkillTradeStatId('Stormcall'))
    expect(normalizeMercenarySkillName('Summon Holy Relic'))
      .toBe(normalizeMercenarySkillName('Holy Relic'))
  })

  it('keeps unknown skill names comparable by normalized text', () => {
    expect(normalizeMercenarySkillName('  Custom Skill  '))
      .toBe('custom skill')
  })
})
