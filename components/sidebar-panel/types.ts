import type { CSSProperties } from 'react'
import type { ApplyTradePageFilter } from '@/hooks/use-trade-page-filter/types'
import type { FilterDraft } from '@/utils/filter-draft/types'

export interface SidebarPanelProps {
  initialFilterDraft?: FilterDraft
  onApplyFilter: ApplyTradePageFilter
}

export interface SidebarPanelStyle extends CSSProperties {
  '--sidebar-right-offset': string
}
