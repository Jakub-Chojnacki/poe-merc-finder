import { GET_TRADE_PAGE_INFO } from "./const";
import type { GetTradePageInfoMessage, TradePageInfo } from "./types";


export function isGetTradePageInfoMessage(
  message: unknown,
): message is GetTradePageInfoMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    message.type === GET_TRADE_PAGE_INFO
  );
}

export function isTradePageInfo(value: unknown): value is TradePageInfo {
  return (
    typeof value === 'object' &&
    value !== null &&
    'listingCount' in value &&
    typeof value.listingCount === 'number' &&
    Number.isInteger(value.listingCount) &&
    value.listingCount >= 0
  );
}
