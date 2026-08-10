import type { MercenarySkillOption } from './types'
import mercenaryData from '@/data/mercenaries.json'
import {
  ALL_SKILL_OPTIONS,
  MERCENARY_SKILL_STAT_IDS,
  MERCENARY_SUPPORT_STAT_IDS,
  SKILL_CATEGORIES,
  SKILL_CATEGORY_LABELS,
} from './const'

export { MERCENARY_OPTIONS, SUPPORT_GEM_NAMES } from './const'

export function getMercenarySkillOptions(
  mercenaryName: string,
): MercenarySkillOption[] {
  const mercenary = mercenaryData.mercenaries.find(
    candidate => candidate.name === mercenaryName,
  )

  if (!mercenary) {
    return ALL_SKILL_OPTIONS
  }

  return SKILL_CATEGORIES.flatMap(category => (
    mercenary.skills[category].map(skill => ({
      name: skill.name,
      label: `${SKILL_CATEGORY_LABELS[category]} • ${skill.supportCount} support count`,
    }))
  ))
}

function normalizeStatName(value: string): string {
  return value.trim().toLocaleLowerCase()
}

export function getMercenarySkillTradeStatId(
  name: string,
): string | undefined {
  return MERCENARY_SKILL_STAT_IDS.get(normalizeStatName(name))
}

export function getMercenarySupportTradeStatId(
  name: string,
): string | undefined {
  return MERCENARY_SUPPORT_STAT_IDS.get(normalizeStatName(name))
}

export function normalizeMercenarySkillName(name: string): string {
  return getMercenarySkillTradeStatId(name) ?? normalizeStatName(name)
}
