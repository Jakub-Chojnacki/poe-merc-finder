import type { TradePageInfo } from "@/utils/trade-page-messaging/types";

export type ConnectionState =
  | { status: 'loading' }
  | { status: 'connected'; info: TradePageInfo }
  | { status: 'unsupported' };