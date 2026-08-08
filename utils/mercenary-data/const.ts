import type {
  MercenaryOption,
  MercenarySkillOption,
  SkillCategory,
} from './types'
import mercenaryData from '@/data/mercenaries.json'

export const SKILL_CATEGORIES = [
  'primary',
  'secondary',
  'utility',
] as const satisfies readonly SkillCategory[]

export const SKILL_CATEGORY_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  utility: 'Utility',
} as const satisfies Record<SkillCategory, string>

export const MERCENARY_OPTIONS: MercenaryOption[]
  = mercenaryData.mercenaries.map(mercenary => ({
    name: mercenary.name,
    attribute: mercenary.attribute,
  }))

export const SUPPORT_GEM_NAMES = mercenaryData.supportGems.map(
  support => support.name,
)

export const ALL_SKILL_OPTIONS: MercenarySkillOption[] = [...new Set(
  mercenaryData.mercenaries.flatMap(mercenary => (
    SKILL_CATEGORIES.flatMap(category => (
      mercenary.skills[category].map(skill => skill.name)
    ))
  )),
)]
  .sort((left, right) => left.localeCompare(right))
  .map(name => ({ name, label: '' }))
