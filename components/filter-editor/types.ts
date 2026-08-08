import type { FilterDraft, SkillRequirementDraft } from '@/utils/filter-draft/types'

export interface FilterEditorProps {
  value: FilterDraft
  onChange: (value: FilterDraft) => void
}

export type UpdatesToRequirement = Partial<Omit<SkillRequirementDraft, 'id'>>
