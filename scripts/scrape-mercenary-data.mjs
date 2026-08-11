import { writeFile } from 'node:fs/promises'
import {
  OUTPUT_PATH,
  POE_WIKI_MERCENARY_CLASSES_PAGE,
  POE_WIKI_MERCENARY_CLASSES_URL,
  POEDB_FETCH_BATCH_SIZE,
  POEDB_MERCENARIES_URL,
  TRADE_STATS_URL,
} from './mercenary-data/constants.mjs'
import {
  fetchParsedWikiPage,
  fetchPoedbPage,
  fetchTradeStats,
} from './mercenary-data/fetch.mjs'
import {
  parseMercenaries,
  writeHouseIcons,
} from './mercenary-data/poe-wiki.mjs'
import {
  addAllowedSupportsToTradeSkills,
  parsePoedbMercenaryUrls,
} from './mercenary-data/poedb.mjs'
import { mapInBatches } from './mercenary-data/shared.mjs'
import {
  parseTradeSkills,
  parseTradeSupportGems,
} from './mercenary-data/trade.mjs'

const [classesPage, tradeStatGroups, poedbMercenariesPage]
  = await Promise.all([
    fetchParsedWikiPage(POE_WIKI_MERCENARY_CLASSES_PAGE),
    fetchTradeStats(),
    fetchPoedbPage(POEDB_MERCENARIES_URL),
  ])

const tradeSkills = parseTradeSkills(tradeStatGroups)
const parsedMercenaries = parseMercenaries(classesPage.text)
const supportGems = parseTradeSupportGems(tradeStatGroups)
const poedbMercenaryUrls = parsePoedbMercenaryUrls(
  poedbMercenariesPage,
  parsedMercenaries.mercenaries,
)
const poedbPages = await mapInBatches(
  poedbMercenaryUrls,
  POEDB_FETCH_BATCH_SIZE,
  async url => ({ url, html: await fetchPoedbPage(url) }),
)
const skills = addAllowedSupportsToTradeSkills(
  tradeSkills,
  supportGems,
  parsedMercenaries.mercenaries,
  poedbPages,
)

await writeHouseIcons(parsedMercenaries.houses)

const houses = parsedMercenaries.houses.map(house => ({
  name: house.name,
  iconPath: house.iconPath,
}))
const runtimeSupportGems = supportGems.map(support => ({
  name: support.name,
  tradeStatId: support.tradeStatId,
}))

const dataset = {
  version: 4,
  generatedAt: new Date().toISOString(),
  sources: [
    {
      page: POE_WIKI_MERCENARY_CLASSES_PAGE,
      revision: classesPage.revid,
      url: POE_WIKI_MERCENARY_CLASSES_URL,
    },
    {
      page: 'Path of Exile trade stats',
      revision: null,
      url: TRADE_STATS_URL,
    },
    {
      page: 'PoEDB mercenary skill support compatibility',
      revision: null,
      url: POEDB_MERCENARIES_URL,
    },
  ],
  houses,
  mercenaries: parsedMercenaries.mercenaries,
  skills,
  supportGems: runtimeSupportGems,
}

await writeFile(OUTPUT_PATH, `${JSON.stringify(dataset, null, 2)}\n`)

const mappedSkillCount = dataset.skills.filter(
  skill => skill.allowedSupportTradeStatIds !== null,
).length

console.log(
  `Wrote ${dataset.mercenaries.length} mercenaries, ${dataset.supportGems.length} support gems, ${mappedSkillCount} skill support mappings, and ${dataset.houses.length} house icons to ${OUTPUT_PATH}`,
)
