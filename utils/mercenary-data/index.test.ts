import { describe, expect, it } from 'vitest'
import {
  getMercenarySkillTradeStatId,
  getMercenarySupportTradeStatId,
  normalizeMercenarySkillName,
} from '.'

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
