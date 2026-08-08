export default defineContentScript({
  matches: ['https://www.pathofexile.com/trade/search/*'],
  main() {
    console.info('PoE Merc Finder is active on this trade search.');
  },
});
