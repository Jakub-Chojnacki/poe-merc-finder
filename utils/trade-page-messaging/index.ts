import { GET_TRADE_PAGE_INFO } from "./const";
import type { GetTradePageInfoMessage, TradePageInfo } from "./types";
import { isNonNullObject } from '@/utils/type-guards';

export function isGetTradePageInfoMessage(
  message: unknown,
): message is GetTradePageInfoMessage {
  return (
    isNonNullObject(message) &&
    'type' in message &&
    message.type === GET_TRADE_PAGE_INFO
  );
}

export function isTradePageInfo(value: unknown): value is TradePageInfo {
  return (
    isNonNullObject(value) &&
    'connected' in value &&
    value.connected === true
  );
}
