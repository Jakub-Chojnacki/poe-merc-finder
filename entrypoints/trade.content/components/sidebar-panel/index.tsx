import type { SidebarPanelProps } from './types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TOGGLE_SIDEBAR_MESSAGE } from '@/extension/messages'
import {
  CollapsibleContent,
  CollapsibleRoot,
} from '@/shared/ui/collapsible'
import MainSidebar from '../main-sidebar'
import {
  COLLAPSED_STORAGE_KEY,
  PAGE_CLASS,
  PAGE_OPEN_CLASS,
} from './const'

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  initialFilterDraft,
  onApplyFilter,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const isCollapsedRef = useRef(true)

  useEffect(() => {
    let isActive = true

    browser.storage.local.get(COLLAPSED_STORAGE_KEY).then((storedState) => {
      const storedCollapsed = storedState[COLLAPSED_STORAGE_KEY]

      if (isActive && typeof storedCollapsed === 'boolean') {
        isCollapsedRef.current = storedCollapsed
        setIsCollapsed(storedCollapsed)
      }
    })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    document.body.classList.add(PAGE_CLASS)

    return () => document.body.classList.remove(PAGE_CLASS)
  }, [])

  useEffect(() => {
    document.body.classList.toggle(PAGE_OPEN_CLASS, !isCollapsed)

    return () => document.body.classList.remove(PAGE_OPEN_CLASS)
  }, [isCollapsed])

  const updateOpen = useCallback((open: boolean) => {
    const collapsed = !open

    isCollapsedRef.current = collapsed
    setIsCollapsed(collapsed)
    void browser.storage.local.set({ [COLLAPSED_STORAGE_KEY]: collapsed })
  }, [])

  useEffect(() => {
    const handleMessage = (message: unknown): void => {
      if (
        typeof message === 'object'
        && message !== null
        && 'type' in message
        && message.type === TOGGLE_SIDEBAR_MESSAGE
      ) {
        updateOpen(isCollapsedRef.current)
      }
    }

    browser.runtime.onMessage.addListener(handleMessage)

    return () => browser.runtime.onMessage.removeListener(handleMessage)
  }, [updateOpen])

  return (
    <CollapsibleRoot
      asChild
      open={!isCollapsed}
      onOpenChange={updateOpen}
    >
      <div className="sidebar-container">
        <CollapsibleContent forceMount asChild>
          <aside
            className="sidebar-panel"
            aria-label="Mercenary support filter"
            aria-hidden={isCollapsed}
            inert={isCollapsed}
          >
            <MainSidebar
              initialFilterDraft={initialFilterDraft}
              onApplyFilter={onApplyFilter}
            />
          </aside>
        </CollapsibleContent>
      </div>
    </CollapsibleRoot>
  )
}

export default SidebarPanel
