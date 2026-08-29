import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'

export type TradeSearchLinkStatus
  = 'idle' | 'generating' | 'generated' | 'copied' | 'error'

export interface UseTradeSearchLinkResult {
  copyLink: () => Promise<void>
  errorMessage: string | undefined
  generateLink: () => Promise<void>
  generatedLink: string | undefined
  status: TradeSearchLinkStatus
  warningMessage: string | undefined
}

export type UseTradeSearchLink = (
  filterDraft: FilterDraft,
) => UseTradeSearchLinkResult
