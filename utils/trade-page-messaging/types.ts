import type { GET_TRADE_PAGE_INFO } from "./const";

 export type GetTradePageInfoMessage = {
  type: typeof GET_TRADE_PAGE_INFO;
};

export type TradePageInfo = {
  connected: true;
};
