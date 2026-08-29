import type { FilterConfig } from '@/features/mercenary-filter/model/filter-config/types'

export interface TradeStatFilter {
  id: string
}

export interface MercenaryTradeStatGroup {
  type: 'mercenary'
  value: {
    min: number
  }
  filters: TradeStatFilter[]
}

export interface AndTradeStatGroup {
  type: 'and'
  filters: TradeStatFilter[]
}

export type TradeStatGroup = AndTradeStatGroup | MercenaryTradeStatGroup

export interface TradeSearchRequest {
  query: {
    status: {
      option: 'securable'
    }
    stats: TradeStatGroup[]
  }
  sort: {
    price: 'asc'
  }
}

export interface TradeSearchResponse {
  id?: unknown
}

export interface TradeSearchErrorResponse {
  error?: {
    message?: unknown
  }
}

export interface TradeSearchContext {
  league: string
  queryId: string | undefined
}

export interface GeneratedTradeSearchLink {
  league: string
  queryId: string
  url: string
}

export interface GenerateTradeSearchLinkOptions {
  fetch?: typeof globalThis.fetch
  pageUrl?: string | URL
}

export type CreateTradeSearchRequest = (
  filter: FilterConfig,
) => TradeSearchRequest
