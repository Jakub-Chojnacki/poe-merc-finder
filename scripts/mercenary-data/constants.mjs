import { resolve } from 'node:path'

export const POE_WIKI_API_URL = 'https://www.poewiki.net/w/api.php'
export const POE_WIKI_BASE_URL = 'https://www.poewiki.net'
export const POE_WIKI_MERCENARY_CLASSES_PAGE = 'List of mercenary classes'
export const POE_WIKI_MERCENARY_CLASSES_URL
  = 'https://www.poewiki.net/wiki/List_of_mercenary_classes'

export const POEDB_BASE_URL = 'https://poedb.tw/us/'
export const POEDB_MERCENARIES_URL
  = new URL('Mercenaries', POEDB_BASE_URL).href
export const POEDB_FETCH_BATCH_SIZE = 5
export const POEDB_INTERNAL_SKILL_PREFIX = '[DNT]'

export const TRADE_STATS_URL
  = 'https://www.pathofexile.com/api/trade/data/stats'

export const HOUSE_ICON_OUTPUT_DIRECTORY = resolve('public/icons/houses')
export const OUTPUT_PATH = resolve('data/mercenaries.json')

export const REQUEST_HEADERS = {
  'User-Agent': 'PoEMercFinder/0.1 (offline dataset generator)',
}

export const EXPECTED_HOUSES = new Set([
  'Azadi',
  'Bardiya',
  'Cyaxan',
  'Keita',
])

export const HOUSE_BY_ATTRIBUTE = {
  'Dex': 'Cyaxan',
  'Dex/Int': 'Azadi',
  'Int': 'Cyaxan',
  'Str': 'Keita',
  'Str/Dex': 'Azadi',
  'Str/Dex/Int': 'Bardiya',
  'Str/Int': 'Keita',
}

export const SUPPORT_COUNTS = {
  H: 'high',
  L: 'low',
  M: 'medium',
  N: 'none',
}

export const SUPPORT_TIERS_BY_ROMAN_NUMERAL = {
  I: 1,
  II: 2,
  III: 3,
}

// Some skills are named differently on the trade site and PoE Wiki.
export const TRADE_SKILL_NAME_OVERRIDES = {
  'Ball Lightning of Orbiting': 'Ball Lightning of Orbiting Trap',
  'Creeping Frost': 'Creeping Frost Trap',
  'Scorching Ray': 'Scorching Ray Totem',
  'Storm Call': 'Stormcall',
  'Summon Holy Relic': 'Holy Relic',
}

export const WHITESPACE_PATTERN = /\s+/g
export const HOUSE_ICON_SOURCE_PATH_PATTERN
  = /^\/images\/thumb\/([^/]+\/[^/]+\/House_([^/]+)_skill_icon\.png)\//
export const SUPPORT_COUNT_CODE_PATTERN = /\(([HLMN])\)/g
export const MERCENARY_CLASS_HEADER_PATTERN = /Mercenary\s*Class/
export const TRAILING_INFAMOUS_MARKER_PATTERN = /\*+$/
export const TRADE_SUPPORT_STAT_TEXT_PATTERN = /^(.*) \(Tier (\d+)\)$/
