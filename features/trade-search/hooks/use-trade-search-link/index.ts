import type {
  TradeSearchLinkStatus,
  UseTradeSearchLinkResult,
} from './types'
import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createFilterConfig } from '@/features/mercenary-filter/model/filter-config'
import { generateTradeSearchLink } from '@/features/trade-search/api/trade-search'
import { saveGeneratedSearchDraft } from '@/features/trade-search/storage/generated-search-drafts'
import { TRADE_SEARCH_LINK_UI_MESSAGES } from './const'

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : TRADE_SEARCH_LINK_UI_MESSAGES.unknownError
}

export function useTradeSearchLink(
  filterDraft: FilterDraft,
): UseTradeSearchLinkResult {
  const requestIdRef = useRef(0)
  const [status, setStatus] = useState<TradeSearchLinkStatus>('idle')
  const [generatedLink, setGeneratedLink] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [warningMessage, setWarningMessage] = useState<string>()

  useEffect(() => () => {
    requestIdRef.current += 1
  }, [])

  const generateLink = useCallback(async (): Promise<void> => {
    const requestId = requestIdRef.current + 1

    requestIdRef.current = requestId
    setStatus('generating')
    setGeneratedLink(undefined)
    setErrorMessage(undefined)
    setWarningMessage(undefined)

    try {
      const generatedSearch = await generateTradeSearchLink(
        createFilterConfig(filterDraft),
      )

      try {
        await saveGeneratedSearchDraft(
          generatedSearch.league,
          generatedSearch.queryId,
          filterDraft,
        )
      }
      catch {
        if (requestId !== requestIdRef.current) {
          return
        }

        setWarningMessage(TRADE_SEARCH_LINK_UI_MESSAGES.storageFailed)
      }

      if (requestId !== requestIdRef.current) {
        return
      }

      setGeneratedLink(generatedSearch.url)
      setStatus('generated')
    }
    catch (error) {
      if (requestId !== requestIdRef.current) {
        return
      }

      setErrorMessage(getErrorMessage(error))
      setStatus('error')
    }
  }, [filterDraft])

  const copyLink = useCallback(async (): Promise<void> => {
    if (!generatedLink) {
      return
    }

    setErrorMessage(undefined)

    try {
      await navigator.clipboard.writeText(generatedLink)
      setStatus('copied')
    }
    catch {
      setErrorMessage(TRADE_SEARCH_LINK_UI_MESSAGES.copyFailed)
      setStatus('error')
    }
  }, [generatedLink])

  return {
    copyLink,
    errorMessage,
    generateLink,
    generatedLink,
    status,
    warningMessage,
  }
}
