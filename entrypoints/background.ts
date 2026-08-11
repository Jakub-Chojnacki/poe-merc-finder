import { TOGGLE_SIDEBAR_MESSAGE } from '@/components/sidebar-panel/const'

export default defineBackground(() => {
  browser.action.onClicked.addListener((tab) => {
    if (tab.id === undefined) {
      return
    }

    browser.tabs.sendMessage(tab.id, {
      type: TOGGLE_SIDEBAR_MESSAGE,
    }).catch(() => undefined)
  })
})
