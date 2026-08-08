import type { FilterConfig } from '@/utils/filter-config/types'
import {
  onTradePageMessage,
} from '@/utils/trade-page-messaging'
import {
  applyTradeFilter,
  clearTradeFilter,
  nodeContainsTradeListing,
} from './dom'
import './style.css'

const HIGHLIGHT_DELAY_MS = 200

export default defineContentScript({
  matches: ['https://*.pathofexile.com/trade/search/*'],
  main(ctx) {
    let highlightTimeoutId: number | undefined

    let activeFilter: FilterConfig = {
      requirements: [],
      hideFailures: false,
    }

    const applyHighlights = (): void => {
      applyTradeFilter(activeFilter)
    }

    const scheduleHighlights = (): void => {
      if (highlightTimeoutId !== undefined) {
        window.clearTimeout(highlightTimeoutId)
      }

      highlightTimeoutId = ctx.setTimeout(() => {
        highlightTimeoutId = undefined
        applyHighlights()
      }, HIGHLIGHT_DELAY_MS)
    }

    const removeGetTradePageInfoListener = onTradePageMessage(
      'getTradePageInfo',
      () => {},
    )

    const removeApplyTradeFilterListener = onTradePageMessage(
      'applyTradeFilter',
      (message) => {
        activeFilter = message.data
        applyHighlights()
      },
    )

    const observer = new MutationObserver((mutations) => {
      const listingsChanged = mutations.some(mutation => (
        [...mutation.addedNodes, ...mutation.removedNodes]
          .some(nodeContainsTradeListing)
      ))

      if (listingsChanged) {
        scheduleHighlights()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    ctx.onInvalidated(() => {
      observer.disconnect()
      removeGetTradePageInfoListener()
      removeApplyTradeFilterListener()
      clearTradeFilter()
    })
  },
})
