import type { SelectOption } from '@/components/select-field/types'
import type { SkillRequirementDraft } from '@/utils/filter-draft/types'

export interface SkillRequirementEditorProps {
  index: number
  onChange: (updates: SkillRequirementUpdates) => void
  onRemove: () => void
  skillOptions: SelectOption[]
  value: SkillRequirementDraft
}

export type SkillRequirementUpdates = Partial<
  Omit<SkillRequirementDraft, 'id'>
>
