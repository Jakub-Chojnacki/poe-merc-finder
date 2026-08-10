import type { FilterDraft } from '@/utils/filter-draft/types'

export type TradeSearchLinkStatus
  = 'idle' | 'generating' | 'generated' | 'copied' | 'error'

export interface UseTradeSearchLinkResult {
  copyLink: () => Promise<void>
  errorMessage: string | undefined
  generateLink: () => Promise<void>
  generatedLink: string | undefined
  resetLink: () => void
  status: TradeSearchLinkStatus
  warningMessage: string | undefined
}

export type UseTradeSearchLink = (
  filterDraft: FilterDraft,
) => UseTradeSearchLinkResult
