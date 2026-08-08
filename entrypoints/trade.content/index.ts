import {
  isGetTradePageInfoMessage,
} from '@/utils/trade-page-messaging';
import { ROW_QUERY_SELECTOR } from './const';
import type { TradePageInfo } from '@/utils/trade-page-messaging/types';

export default defineContentScript({
  matches: ['https://*.pathofexile.com/trade/search/*'],
  main() {
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!isGetTradePageInfoMessage(message)) {
        return;
      }

      const response: TradePageInfo = {
        listingCount: document.querySelectorAll(ROW_QUERY_SELECTOR).length,
      };

      sendResponse(response);
    });
  },
});
