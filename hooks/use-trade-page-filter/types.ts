import type { FilterConfig } from '@/utils/filter-config/types'

export type FilterApplyStatus = 'idle' | 'applying' | 'applied' | 'error'

export type ApplyTradePageFilter = (
  filter: FilterConfig,
) => Promise<void> | void
