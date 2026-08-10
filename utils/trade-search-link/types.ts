import type { FilterConfig } from '@/utils/filter-config/types'

export interface TradeStatFilter {
  id: string
}

export interface TradeStatGroup {
  type: 'mercenary'
  value: {
    min: number
  }
  filters: TradeStatFilter[]
}

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
