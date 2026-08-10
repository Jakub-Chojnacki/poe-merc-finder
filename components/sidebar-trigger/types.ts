import type { CSSProperties } from 'react'
import type { ApplyTradePageFilter } from '@/hooks/use-trade-page-filter/types'
import type { FilterDraft } from '@/utils/filter-draft/types'

export interface SidebarTriggerProps {
  initialFilterDraft?: FilterDraft
  onApplyFilter: ApplyTradePageFilter
}

export interface SidebarStyle extends CSSProperties {
  '--sidebar-right-offset': string
}
