import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'PoE Merc Finder',
    description: 'Filter Path of Exile mercenary trade listings by skills and their linked support gems.',
    minimum_chrome_version: '114',
    action: {
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
      },
      default_title: 'Toggle PoE Merc Finder',
    },
    permissions: ['storage'],
  },
})
