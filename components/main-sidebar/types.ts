import type { ApplyTradePageFilter } from '@/hooks/use-trade-page-filter/types'

export interface MainSidebarProps {
  onApplyFilter: ApplyTradePageFilter
  onCollapse: () => void
}
