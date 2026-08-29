import type { SkillRequirementDraft } from '@/features/mercenary-filter/model/filter-draft/types'
import type { SelectOption } from '@/shared/ui/select-field/types'

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
