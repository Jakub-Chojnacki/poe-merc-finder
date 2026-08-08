import type { ConnectionState, FilterSyncStatus } from './types'
import { useCallback, useEffect, useState } from 'react'
import { createFilterConfig } from '@/utils/filter-config'
import { createEmptyFilterDraft } from '@/utils/filter-draft'
import { sendTradePageMessage } from '@/utils/trade-page-messaging'
import { FILTER_SYNC_DELAY_MS } from './const'

export function useTradePageFilter() {
  const [connection, setConnection] = useState<ConnectionState>({
    status: 'loading',
  })

  const [filterSyncStatus, setFilterSyncStatus]
    = useState<FilterSyncStatus>('idle')

  const [filterDraft, setFilterDraft] = useState(createEmptyFilterDraft)

  const checkConnection = useCallback(async () => {
    setConnection({ status: 'loading' })
    setFilterSyncStatus('idle')

    const [activeTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })

    if (activeTab?.id === undefined) {
      setConnection({ status: 'unsupported' })
      return
    }

    try {
      await sendTradePageMessage('getTradePageInfo', undefined, activeTab.id)
      setConnection({ status: 'connected' })
    }
    catch {
      setConnection({ status: 'unsupported' })
    }
  }, [])

  const refreshTradePage = useCallback(async () => {
    const [activeTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })

    if (activeTab?.id === undefined) {
      return
    }

    setConnection({ status: 'loading' })
    setFilterSyncStatus('idle')
    await browser.tabs.reload(activeTab.id)
  }, [])

  useEffect(() => {
    checkConnection()

    const handleTabActivated = () => {
      checkConnection()
    }

    const handleTabUpdated = (
      _tabId: number,
      changeInfo: { status?: string },
    ) => {
      if (changeInfo.status === 'complete') {
        checkConnection()
      }
    }

    browser.tabs.onActivated.addListener(handleTabActivated)
    browser.tabs.onUpdated.addListener(handleTabUpdated)

    return () => {
      browser.tabs.onActivated.removeListener(handleTabActivated)
      browser.tabs.onUpdated.removeListener(handleTabUpdated)
    }
  }, [checkConnection])

  const isConnected = connection.status === 'connected'

  useEffect(() => {
    if (!isConnected) {
      return
    }

    const timeoutId = window.setTimeout(async () => {
      setFilterSyncStatus('syncing')

      const [activeTab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (activeTab?.id === undefined) {
        setFilterSyncStatus('error')
        return
      }

      try {
        await sendTradePageMessage(
          'applyTradeFilter',
          createFilterConfig(filterDraft),
          activeTab.id,
        )
        setFilterSyncStatus('synced')
      }
      catch {
        setFilterSyncStatus('error')
      }
    }, FILTER_SYNC_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [filterDraft, isConnected])

  return {
    checkConnection,
    connection,
    filterDraft,
    filterSyncStatus,
    refreshTradePage,
    setFilterDraft,
  }
}
