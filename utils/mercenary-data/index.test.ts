import { describe, expect, it } from 'vitest'
import {
  getMercenarySkillOptions,
  getMercenarySkillTradeStatId,
  getMercenarySupportTradeStatId,
  normalizeMercenarySkillName,
} from '.'
import { MERCENARY_OPTIONS } from './const'

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
