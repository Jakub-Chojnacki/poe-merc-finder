import type { FilterConfig } from '@/utils/filter-config/types'
import type { FilterDraft } from '@/utils/filter-draft/types'

export type FilterApplyStatus = 'idle' | 'applying' | 'applied' | 'error'

export type ApplyTradePageFilter = (
  filter: FilterConfig,
) => Promise<void> | void

export interface UseTradePageFilterResult {
  applyFilter: () => Promise<void>
  filterApplyStatus: FilterApplyStatus
  filterDraft: FilterDraft
  setFilterDraft: (value: FilterDraft) => void
}
