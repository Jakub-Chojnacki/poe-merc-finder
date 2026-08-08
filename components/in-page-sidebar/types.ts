import type { CSSProperties } from 'react'
import type { ApplyTradePageFilter } from '@/hooks/use-trade-page-filter/types'

export interface InPageSidebarProps {
  onApplyFilter: ApplyTradePageFilter
}

export interface SidebarStyle extends CSSProperties {
  '--sidebar-right-offset': string
}
