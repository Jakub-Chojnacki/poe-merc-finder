import type { FilterApplyStatus } from '@/hooks/use-trade-page-filter/types'
import type { FilterDraft } from '@/utils/filter-draft/types'

export interface FilterEditorProps {
  applyStatus: FilterApplyStatus
  onApply: () => Promise<void>
  value: FilterDraft
  onChange: (value: FilterDraft) => void
}
