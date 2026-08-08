import mercenaryData from '@/data/mercenaries.json'

const SKILL_CATEGORIES = ['primary', 'secondary', 'utility'] as const
const SKILL_CATEGORY_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  utility: 'Utility',
} as const

export const MERCENARY_OPTIONS = mercenaryData.mercenaries.map(mercenary => ({
  name: mercenary.name,
  attribute: mercenary.attribute,
}))

export const SUPPORT_GEM_NAMES = mercenaryData.supportGems.map(
  support => support.name,
)

const allSkillOptions = [...new Set(
  mercenaryData.mercenaries.flatMap(mercenary => (
    SKILL_CATEGORIES.flatMap(category => (
      mercenary.skills[category].map(skill => skill.name)
    ))
  )),
)]
  .sort((left, right) => left.localeCompare(right))
  .map(name => ({ name, label: '' }))

export function getMercenarySkillOptions(mercenaryName: string) {
  const mercenary = mercenaryData.mercenaries.find(
    candidate => candidate.name === mercenaryName,
  )

  if (!mercenary) {
    return allSkillOptions
  }

  return SKILL_CATEGORIES.flatMap(category => (
    mercenary.skills[category].map(skill => ({
      name: skill.name,
      label: `${SKILL_CATEGORY_LABELS[category]} • ${skill.supportCount} support count`,
    }))
  ))
}
