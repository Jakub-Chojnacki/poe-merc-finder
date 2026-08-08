import type { MercenarySkillOption } from './types'
import mercenaryData from '@/data/mercenaries.json'
import {
  ALL_SKILL_OPTIONS,
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
