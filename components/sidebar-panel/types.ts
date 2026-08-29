import type { ApplyTradePageFilter } from '@/hooks/use-trade-page-filter/types'
import type { FilterDraft } from '@/utils/filter-draft/types'

export interface SidebarPanelProps {
  initialFilterDraft?: FilterDraft
  onApplyFilter: ApplyTradePageFilter
}
