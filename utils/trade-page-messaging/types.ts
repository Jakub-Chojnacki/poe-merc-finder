import type { GET_TRADE_PAGE_INFO } from './const'

export interface GetTradePageInfoMessage {
  type: typeof GET_TRADE_PAGE_INFO
}

export interface TradePageInfo {
  connected: true
}
