import type { PublicPath } from 'wxt/browser'
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

export const HOUSE_ICON_PATHS = new Map<string, PublicPath>(
  mercenaryData.houses.map(house => (
    [house.name, house.iconPath as PublicPath]
  )),
)

export const MERCENARY_OPTIONS: MercenaryOption[]
  = mercenaryData.mercenaries.map(mercenary => ({
    attribute: mercenary.attribute,
    iconPath: HOUSE_ICON_PATHS.get(mercenary.house)!,
    house: mercenary.house,
    name: mercenary.name,
  }))

export const SUPPORT_GEM_NAMES = mercenaryData.supportGems.map(
  support => support.name,
)

function normalizeStatName(value: string): string {
  return value.trim().toLocaleLowerCase()
}

export const MERCENARY_SKILL_STAT_IDS = new Map<string, string>([
  ...mercenaryData.skills.flatMap(skill => (
    [skill.name, ...skill.aliases].map(name => (
      [normalizeStatName(name), skill.tradeStatId] as const
    ))
  )),
  ...mercenaryData.mercenaries.flatMap(mercenary => (
    SKILL_CATEGORIES.flatMap(category => (
      mercenary.skills[category].map(skill => (
        [normalizeStatName(skill.name), skill.tradeStatId] as const
      ))
    ))
  )),
])

export const MERCENARY_SUPPORT_STAT_IDS = new Map(
  mercenaryData.supportGems.map(support => (
    [normalizeStatName(support.name), support.tradeStatId] as const
  )),
)

export const ALL_SKILL_OPTIONS: MercenarySkillOption[] = [...new Set([
  ...mercenaryData.skills.map(skill => skill.name),
  ...mercenaryData.mercenaries.flatMap(mercenary => (
    SKILL_CATEGORIES.flatMap(category => (
      mercenary.skills[category].map(skill => skill.name)
    ))
  )),
])]
  .sort((left, right) => left.localeCompare(right))
  .map(name => ({ name, label: '' }))
