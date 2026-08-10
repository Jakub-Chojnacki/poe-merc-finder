import type {
  TradeSearchLinkStatus,
  UseTradeSearchLinkResult,
} from './types'
import type { FilterDraft } from '@/utils/filter-draft/types'
import { useCallback, useRef, useState } from 'react'
import { createFilterConfig } from '@/utils/filter-config'
import { saveGeneratedSearchDraft } from '@/utils/generated-search-drafts'
import { generateTradeSearchLink } from '@/utils/trade-search-link'
import { TRADE_SEARCH_LINK_UI_MESSAGES } from './const'

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : TRADE_SEARCH_LINK_UI_MESSAGES.unknownError
}

export function useTradeSearchLink(
  filterDraft: FilterDraft,
): UseTradeSearchLinkResult {
  const filterDraftKey = JSON.stringify(filterDraft)
  const requestIdRef = useRef(0)

  const [activeDraftKey, setActiveDraftKey] = useState<string>()
  const [status, setStatus] = useState<TradeSearchLinkStatus>('idle')
  const [generatedLink, setGeneratedLink] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [warningMessage, setWarningMessage] = useState<string>()

  const resetLink = useCallback((): void => {
    requestIdRef.current += 1

    setActiveDraftKey(undefined)
    setStatus('idle')
    setGeneratedLink(undefined)
    setErrorMessage(undefined)
    setWarningMessage(undefined)
  }, [])

  const generateLink = useCallback(async (): Promise<void> => {
    const requestId = requestIdRef.current + 1

    requestIdRef.current = requestId
    setActiveDraftKey(filterDraftKey)
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
  }, [filterDraft, filterDraftKey])

  const isCurrentDraft = activeDraftKey === filterDraftKey
  const currentGeneratedLink = isCurrentDraft ? generatedLink : undefined
  const currentStatus = isCurrentDraft ? status : 'idle'

  const copyLink = useCallback(async (): Promise<void> => {
    if (!currentGeneratedLink) {
      return
    }

    setErrorMessage(undefined)

    try {
      await navigator.clipboard.writeText(currentGeneratedLink)
      setStatus('copied')
    }
    catch {
      setErrorMessage(TRADE_SEARCH_LINK_UI_MESSAGES.copyFailed)
      setStatus('error')
    }
  }, [currentGeneratedLink])

  return {
    copyLink,
    errorMessage: isCurrentDraft ? errorMessage : undefined,
    generateLink,
    generatedLink: currentGeneratedLink,
    resetLink,
    status: currentStatus,
    warningMessage: isCurrentDraft ? warningMessage : undefined,
  }
}
