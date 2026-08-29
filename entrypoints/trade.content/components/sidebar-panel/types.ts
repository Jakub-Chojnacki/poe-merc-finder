import type { ApplyTradePageFilter } from '@/features/mercenary-filter/hooks/use-trade-page-filter/types'
import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'

export interface SidebarPanelProps {
  initialFilterDraft?: FilterDraft
  onApplyFilter: ApplyTradePageFilter
}
