import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'PoE Merc Finder',
    description: 'Filter Path of Exile mercenary trade listings by skills and their linked support gems.',
    minimum_chrome_version: '114',
    permissions: ['storage'],
  },
})
