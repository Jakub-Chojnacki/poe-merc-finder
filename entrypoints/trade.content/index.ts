import type { TradePageInfo } from '@/utils/trade-page-messaging/types'
import {
  isGetTradePageInfoMessage,
} from '@/utils/trade-page-messaging'

export default defineContentScript({
  matches: ['https://*.pathofexile.com/trade/search/*'],
  main() {
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!isGetTradePageInfoMessage(message)) {
        return
      }

      const response: TradePageInfo = { connected: true }
      sendResponse(response)
    })
  },
})
