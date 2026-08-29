import type { FilterApplyStatus } from '@/features/mercenary-filter/hooks/use-trade-page-filter/types'
import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'

export interface FilterActionsProps {
  applyStatus: FilterApplyStatus
  filterDraft: FilterDraft
  onApply: () => Promise<void>
}
