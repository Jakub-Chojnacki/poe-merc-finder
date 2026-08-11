import type { SkillRequirementDraft } from '@/utils/filter-draft/types'

export interface ImportedWarrantFilter {
  mercenaryClass: string
  requirements: SkillRequirementDraft[]
}
