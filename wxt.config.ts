import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'PoE Merc Finder',
    description: 'Filter mercenaries based on links for a specific gem',
    minimum_chrome_version: '114',
    permissions: ['sidePanel', 'storage'],
    action: {
      default_title: 'Open PoE Merc Finder',
    },
  },
})
