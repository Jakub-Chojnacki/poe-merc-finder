import type { FilterApplyStatus } from '@/hooks/use-trade-page-filter/types'
import type { FilterDraft } from '@/utils/filter-draft/types'

export interface FilterActionsProps {
  applyStatus: FilterApplyStatus
  filterDraft: FilterDraft
  onApply: () => Promise<void>
}
