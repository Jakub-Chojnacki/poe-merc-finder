import type { TradeSearchLinkStatus } from './types'

export const GENERATE_LINK_BUTTON_LABELS = {
  copied: 'Generate new link',
  error: 'Try generating again',
  generated: 'Generate new link',
  generating: 'Generating…',
  idle: 'Generate search link',
} as const satisfies Record<TradeSearchLinkStatus, string>

export const COPY_LINK_BUTTON_LABELS = {
  copied: 'Copied',
  error: 'Copy link',
  generated: 'Copy link',
  generating: 'Copy link',
  idle: 'Copy link',
} as const satisfies Record<TradeSearchLinkStatus, string>

export const TRADE_SEARCH_LINK_UI_MESSAGES = {
  copyFailed: 'The generated link could not be copied.',
  storageFailed: 'The link works, but its optional filters could not be saved for automatic restoration.',
  unknownError: 'The search link could not be generated.',
} as const
