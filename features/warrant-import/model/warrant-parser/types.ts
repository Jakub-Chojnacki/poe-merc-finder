import type { SkillRequirementDraft } from '@/features/mercenary-filter/model/filter-draft/types'

export interface ImportedWarrantFilter {
  mercenaryClass: string
  requirements: SkillRequirementDraft[]
}
