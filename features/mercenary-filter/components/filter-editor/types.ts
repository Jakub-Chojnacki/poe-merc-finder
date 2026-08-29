import type { FilterApplyStatus } from '@/features/mercenary-filter/hooks/use-trade-page-filter/types'
import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'

export interface FilterEditorProps {
  applyStatus: FilterApplyStatus
  onApply: () => Promise<void>
  value: FilterDraft
  onChange: (value: FilterDraft) => void
}
