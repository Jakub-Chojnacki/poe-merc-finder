import type { SkillRequirementDraft } from '@/utils/filter-draft/types'

export interface SkillRequirementEditorProps {
  index: number
  onChange: (updates: SkillRequirementUpdates) => void
  onRemove: () => void
  value: SkillRequirementDraft
}

export type SkillRequirementUpdates = Partial<
  Omit<SkillRequirementDraft, 'id'>
>
