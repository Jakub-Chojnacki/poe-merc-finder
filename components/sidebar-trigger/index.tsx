import type { SidebarStyle, SidebarTriggerProps } from './types'
import { useCallback, useEffect, useState } from 'react'
import AppIcon from '@/components/icons/app'
import ChevronIcon from '@/components/icons/chevron'
import MainSidebar from '@/components/main-sidebar'
import { useBetterTradingOffset } from '@/hooks/use-better-trading-offset'
import {
  COLLAPSED_STORAGE_KEY,
  PAGE_CLASS,
  PAGE_OPEN_CLASS,
} from './const'

const SidebarTrigger: React.FC<SidebarTriggerProps> = ({
  initialFilterDraft,
  onApplyFilter,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const betterTradingOffset = useBetterTradingOffset()

  useEffect(() => {
    let isActive = true

    browser.storage.local.get(COLLAPSED_STORAGE_KEY).then((storedState) => {
      if (isActive && storedState[COLLAPSED_STORAGE_KEY] === true) {
        setIsCollapsed(true)
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

  const updateCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed)
    browser.storage.local.set({ [COLLAPSED_STORAGE_KEY]: collapsed })
  }, [])

  const sidebarClassName = isCollapsed
    ? 'sidebar-trigger sidebar-trigger--collapsed'
    : 'sidebar-trigger'

  const sidebarStyle: SidebarStyle = {
    '--sidebar-right-offset': `${betterTradingOffset}px`,
  }

  return (
    <div className={sidebarClassName} style={sidebarStyle}>
      <aside
        className="sidebar-panel"
        aria-label="Mercenary support filter"
        aria-hidden={isCollapsed}
        inert={isCollapsed}
      >
        <MainSidebar
          initialFilterDraft={initialFilterDraft}
          onApplyFilter={onApplyFilter}
          onCollapse={() => updateCollapsed(true)}
        />
      </aside>

      <button
        type="button"
        className="sidebar-expand-button"
        aria-label="Open mercenary support filter"
        title="Open mercenary support filter"
        onClick={() => updateCollapsed(false)}
      >
        <AppIcon
          className="sidebar-expand-button__icon"
        />
        <ChevronIcon
          className="sidebar-chevron sidebar-chevron--left"
        />
      </button>
    </div>
  )
}

export default SidebarTrigger
