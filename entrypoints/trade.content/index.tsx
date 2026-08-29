import type { Root } from 'react-dom/client'
import type { FilterConfig } from '@/features/mercenary-filter/model/filter-config/types'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createFilterConfig } from '@/features/mercenary-filter/model/filter-config'
import { getGeneratedSearchDraft } from '@/features/trade-search/storage/generated-search-drafts'
import UiProvider from '@/shared/ui/provider'
import SidebarPanel from './components/sidebar-panel'
import { HIGHLIGHT_DELAY_MS } from './const'
import {
  applyTradeFilter,
  clearTradeFilter,
  nodeContainsTradeListing,
} from './dom'
import panelStyles from './panel.css?inline'
import './style.css'

export default defineContentScript({
  matches: ['https://*.pathofexile.com/*'],
  async main(ctx) {
    let highlightTimeoutId: number | undefined
    const initialFilterDraft = await getGeneratedSearchDraft(window.location.href)
      .catch(() => undefined)

    let activeFilter: FilterConfig = initialFilterDraft
      ? createFilterConfig(initialFilterDraft)
      : {
          requirements: [],
          hideFailures: false,
        }

    const applyHighlights = (): void => {
      applyTradeFilter(activeFilter)
    }

    const applyFilter = (filter: FilterConfig): void => {
      activeFilter = filter
      applyHighlights()
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

    const ui = await createShadowRootUi<Root>(ctx, {
      name: 'poe-merc-finder-sidebar',
      position: 'inline',
      anchor: 'body',
      css: panelStyles,
      isolateEvents: true,
      onMount(container) {
        const app = document.createElement('div')
        const portalContainer = document.createElement('div')

        app.className = 'extension-root'
        portalContainer.className = 'extension-portals'

        container.append(app, portalContainer)

        const root = createRoot(app)
        root.render(
          <StrictMode>
            <UiProvider portalContainer={portalContainer}>
              <SidebarPanel
                initialFilterDraft={initialFilterDraft}
                onApplyFilter={applyFilter}
              />
            </UiProvider>
          </StrictMode>,
        )

        return root
      },
      onRemove(root) {
        root?.unmount()
      },
    })

    ui.mount()
    applyHighlights()

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

      if (highlightTimeoutId !== undefined) {
        window.clearTimeout(highlightTimeoutId)
      }

      clearTradeFilter()
    })
  },
})
