import type { FilterConfig } from '@/utils/filter-config/types'
import { defineExtensionMessaging } from '@webext-core/messaging'

interface TradePageProtocolMap {
  applyTradeFilter: (filter: FilterConfig) => void
  getTradePageInfo: () => void
}

export const {
  onMessage: onTradePageMessage,
  sendMessage: sendTradePageMessage,
} = defineExtensionMessaging<TradePageProtocolMap>()
