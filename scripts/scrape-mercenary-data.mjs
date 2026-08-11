import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { load } from 'cheerio'

const API_URL = 'https://www.poewiki.net/w/api.php'
const MERCENARY_CLASSES_PAGE = 'List of mercenary classes'
const MERCENARY_PAGE = 'Mercenary'
const HOUSE_ICON_OUTPUT_DIRECTORY = resolve('public/icons/houses')
const OUTPUT_PATH = resolve('data/mercenaries.json')
const TRADE_STATS_URL = 'https://www.pathofexile.com/api/trade/data/stats'

const EXPECTED_HOUSES = new Set([
  'Azadi',
  'Bardiya',
  'Cyaxan',
  'Keita',
])

const HOUSE_BY_ATTRIBUTE = {
  'Dex': 'Cyaxan',
  'Dex/Int': 'Azadi',
  'Int': 'Cyaxan',
  'Str': 'Keita',
  'Str/Dex': 'Azadi',
  'Str/Dex/Int': 'Bardiya',
  'Str/Int': 'Keita',
}

const SUPPORT_COUNTS = {
  H: 'high',
  L: 'low',
  M: 'medium',
  N: 'none',
}

const TRADE_SKILL_NAME_OVERRIDES = {
  'Ball Lightning of Orbiting': 'Ball Lightning of Orbiting Trap',
  'Creeping Frost': 'Creeping Frost Trap',
  'Scorching Ray': 'Scorching Ray Totem',
  'Storm Call': 'Stormcall',
  'Summon Holy Relic': 'Holy Relic',
}

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function parseHouseIcon(activator) {
  const sourcePath = activator.find('img').first().attr('src') ?? ''
  const match = sourcePath.match(
    /^\/images\/thumb\/([^/]+\/[^/]+\/House_([^/]+)_skill_icon\.png)\//,
  )

  if (!match) {
    return undefined
  }

  const name = match[2]

  return {
    name,
    iconPath: `/icons/houses/${name.toLowerCase()}.png`,
    sourceUrl: new URL(`/images/${match[1]}`, 'https://www.poewiki.net').href,
  }
}

async function fetchParsedPage(page) {
  const search = new URLSearchParams({
    action: 'parse',
    format: 'json',
    formatversion: '2',
    page,
    prop: 'text|revid',
  })

  const response = await fetch(`${API_URL}?${search}`, {
    headers: {
      'User-Agent': 'PoEMercFinder/0.1 (offline dataset generator)',
    },
  })

  if (!response.ok) {
    throw new Error(`Could not fetch ${page}: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()

  if (!result.parse?.text || typeof result.parse.revid !== 'number') {
    throw new Error(`PoE Wiki returned an unexpected response for ${page}`)
  }

  return result.parse
}

async function fetchTradeStats() {
  const response = await fetch(TRADE_STATS_URL, {
    headers: {
      'User-Agent': 'PoEMercFinder/0.1 (offline dataset generator)',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Could not fetch trade stats: ${response.status} ${response.statusText}`,
    )
  }

  const result = await response.json()

  if (!Array.isArray(result.result)) {
    throw new TypeError('Path of Exile returned an unexpected trade stats response')
  }

  return result.result
}

function parseSkillCell($, cell, housesByName) {
  const hoverboxes = $(cell).find('.hoverbox').toArray()
  const supportCodes = [...$(cell).text().matchAll(/\(([HLMN])\)/g)]

  if (hoverboxes.length !== supportCodes.length) {
    throw new Error(
      `Could not pair skills with support counts in: ${normalizeText($(cell).text())}`,
    )
  }

  return hoverboxes.map((hoverbox, index) => {
    const activator = $(hoverbox).find('.hoverbox__activator').first()
    const name = normalizeText(activator.text())
    const supportCode = supportCodes[index][1]
    const house = parseHouseIcon(activator)

    if (!name || !(supportCode in SUPPORT_COUNTS)) {
      throw new Error(`Could not parse mercenary skill: ${$(hoverbox).text()}`)
    }

    if (house) {
      housesByName.set(house.name, house)
    }

    return {
      name,
      supportCount: SUPPORT_COUNTS[supportCode],
    }
  })
}

function parseMercenaries(html) {
  const $ = load(html)
  const housesByName = new Map()
  const mercenaries = []

  $('table.wikitable.sortable').each((_, table) => {
    const headerText = normalizeText($(table).find('tr').slice(0, 2).text())

    if (
      !/Mercenary\s*Class/.test(headerText)
      || !headerText.includes('Primary')
      || !headerText.includes('Secondary')
      || !headerText.includes('Utility')
    ) {
      return
    }

    const classCellIndex = headerText.includes('House') ? 1 : 0

    $(table).find('tr').each((_, row) => {
      const cells = $(row).children('td').toArray()

      if (cells.length < classCellIndex + 7) {
        return
      }

      const rawName = normalizeText($(cells[classCellIndex]).text())
      const name = rawName.replace(/\*+$/, '').trim()

      if (!name) {
        return
      }

      const attribute = normalizeText($(cells[classCellIndex + 1]).text())
      const house = HOUSE_BY_ATTRIBUTE[attribute]

      if (!house) {
        throw new Error(`Could not determine house for ${name}: ${attribute}`)
      }

      mercenaries.push({
        name,
        attribute,
        house,
        infamous: rawName.endsWith('*'),
        skills: {
          primary: parseSkillCell($, cells[classCellIndex + 4], housesByName),
          secondary: parseSkillCell($, cells[classCellIndex + 5], housesByName),
          utility: parseSkillCell($, cells[classCellIndex + 6], housesByName),
        },
      })
    })
  })

  if (mercenaries.length < 30) {
    throw new Error(`Expected at least 30 mercenary classes, found ${mercenaries.length}`)
  }

  const houses = [...housesByName.values()].sort(
    (left, right) => left.name.localeCompare(right.name),
  )
  const missingHouses = [...EXPECTED_HOUSES].filter(
    house => !housesByName.has(house),
  )

  if (missingHouses.length > 0 || houses.length !== EXPECTED_HOUSES.size) {
    throw new Error(
      `Expected house icons for ${[...EXPECTED_HOUSES].join(', ')}, found ${houses.map(house => house.name).join(', ')}`,
    )
  }

  return {
    houses,
    mercenaries: mercenaries.sort(
      (left, right) => left.name.localeCompare(right.name),
    ),
  }
}

async function writeHouseIcons(houses) {
  const icons = await Promise.all(houses.map(async (house) => {
    const response = await fetch(house.sourceUrl, {
      headers: {
        'User-Agent': 'PoEMercFinder/0.1 (offline dataset generator)',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Could not fetch ${house.name} house icon: ${response.status} ${response.statusText}`,
      )
    }

    return {
      data: new Uint8Array(await response.arrayBuffer()),
      house,
    }
  }))

  await mkdir(HOUSE_ICON_OUTPUT_DIRECTORY, { recursive: true })

  await Promise.all(icons.map(({ data, house }) => (
    writeFile(
      resolve('public', house.iconPath.slice(1)),
      data,
    )
  )))
}

function parseTier(rawName) {
  const match = rawName.match(/\s+(I|II|III)$/)

  if (!match) {
    return { name: rawName, tier: undefined }
  }

  return {
    name: rawName.slice(0, -match[0].length),
    tier: { I: 1, II: 2, III: 3 }[match[1]],
  }
}

function parseExclusiveSupportGems(html) {
  const $ = load(html)
  const heading = $('#List_of_mercenary_exclusive_support_gems').closest('h2')
  const table = heading.nextAll('table.wikitable').first()
  const supportGems = []

  table.find('tr').each((_, row) => {
    const cells = $(row).children('td').toArray()

    if (cells.length < 3) {
      return
    }

    const grade = normalizeText($(cells[0]).text()).toLowerCase() || 'normal'
    const rawName = normalizeText($(cells[1]).text())

    if (!rawName) {
      return
    }

    const { name, tier } = parseTier(rawName)
    const prefix = grade === 'normal'
      ? ''
      : `${grade[0].toUpperCase()}${grade.slice(1)} `

    supportGems.push({
      name: `${prefix}${name}`,
      baseName: name,
      grade,
      tier,
      description: normalizeText(
        cells.slice(2).map(cell => $(cell).text()).join(' '),
      ),
    })
  })

  if (supportGems.length < 50) {
    throw new Error(`Expected at least 50 support gems, found ${supportGems.length}`)
  }

  return supportGems.sort((left, right) => (
    left.name.localeCompare(right.name) || (left.tier ?? 0) - (right.tier ?? 0)
  ))
}

function parseTradeSupportGems(statGroups, exclusiveSupportGems) {
  const descriptions = new Map(
    exclusiveSupportGems.map(support => (
      [`${support.name}|${support.tier}`, support.description]
    )),
  )
  const supportGemsByName = new Map()

  statGroups
    .flatMap(group => group.entries)
    .filter(entry => (
      entry.type === 'mercenary'
      && entry.id.startsWith('mercenary.support_')
    ))
    .forEach((entry) => {
      const match = entry.text.match(/^(.*) \(Tier (\d+)\)$/)

      if (!match) {
        throw new Error(`Could not parse mercenary support stat: ${entry.text}`)
      }

      const name = match[1]
      const tier = Number(match[2])
      const gradeMatch = name.match(/^(Lesser|Greater|Gilded) /)
      const grade = gradeMatch?.[1].toLowerCase() ?? 'normal'
      const key = `${name}|${tier}`

      supportGemsByName.set(key, {
        name,
        baseName: name.replace(/^(Lesser|Greater|Gilded) /, ''),
        grade,
        tier,
        description: descriptions.get(key) ?? null,
        tradeStatId: entry.id,
      })
    })

  const supportGems = [...supportGemsByName.values()].sort((left, right) => (
    left.name.localeCompare(right.name) || left.tier - right.tier
  ))

  if (supportGems.length < 100) {
    throw new Error(
      `Expected at least 100 trade support gems, found ${supportGems.length}`,
    )
  }

  return supportGems
}

function parseTradeSkills(statGroups) {
  const aliasesByName = Object.entries(TRADE_SKILL_NAME_OVERRIDES).reduce(
    (result, [alias, name]) => {
      const aliases = result.get(name) ?? []

      aliases.push(alias)
      result.set(name, aliases)

      return result
    },
    new Map(),
  )

  const skills = statGroups
    .flatMap(group => group.entries)
    .filter(entry => (
      entry.type === 'mercenary'
      && entry.id.startsWith('mercenary.skill_')
    ))
    .map(entry => ({
      name: entry.text,
      aliases: aliasesByName.get(entry.text) ?? [],
      tradeStatId: entry.id,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))

  if (skills.length < 250) {
    throw new Error(`Expected at least 250 mercenary skills, found ${skills.length}`)
  }

  return skills
}

function addTradeStatIdsToMercenaries(mercenaries, tradeSkills) {
  const tradeSkillsByName = new Map(
    tradeSkills.map(skill => [skill.name, skill]),
  )

  return mercenaries.map(mercenary => ({
    ...mercenary,
    skills: Object.fromEntries(
      Object.entries(mercenary.skills).map(([category, skills]) => (
        [
          category,
          skills.map((skill) => {
            const tradeName = TRADE_SKILL_NAME_OVERRIDES[skill.name] ?? skill.name
            const tradeSkill = tradeSkillsByName.get(tradeName)

            if (!tradeSkill) {
              throw new Error(`Could not find trade stat for mercenary skill: ${skill.name}`)
            }

            return {
              ...skill,
              tradeStatId: tradeSkill.tradeStatId,
            }
          }),
        ]
      )),
    ),
  }))
}

const [classesPage, mercenaryPage, tradeStatGroups] = await Promise.all([
  fetchParsedPage(MERCENARY_CLASSES_PAGE),
  fetchParsedPage(MERCENARY_PAGE),
  fetchTradeStats(),
])

const exclusiveSupportGems = parseExclusiveSupportGems(mercenaryPage.text)
const tradeSkills = parseTradeSkills(tradeStatGroups)
const parsedMercenaries = parseMercenaries(classesPage.text)
const mercenaries = addTradeStatIdsToMercenaries(
  parsedMercenaries.mercenaries,
  tradeSkills,
)

await writeHouseIcons(parsedMercenaries.houses)

const dataset = {
  version: 3,
  generatedAt: new Date().toISOString(),
  sources: [
    {
      page: MERCENARY_CLASSES_PAGE,
      revision: classesPage.revid,
      url: 'https://www.poewiki.net/wiki/List_of_mercenary_classes',
    },
    {
      page: MERCENARY_PAGE,
      revision: mercenaryPage.revid,
      url: 'https://www.poewiki.net/wiki/Mercenary#List_of_mercenary_exclusive_support_gems',
    },
    {
      page: 'Path of Exile trade stats',
      revision: null,
      url: TRADE_STATS_URL,
    },
  ],
  houses: parsedMercenaries.houses,
  mercenaries,
  skills: tradeSkills,
  supportGems: parseTradeSupportGems(tradeStatGroups, exclusiveSupportGems),
}

await writeFile(OUTPUT_PATH, `${JSON.stringify(dataset, null, 2)}\n`)

console.log(
  `Wrote ${dataset.mercenaries.length} mercenaries, ${dataset.supportGems.length} support gems, and ${dataset.houses.length} house icons to ${OUTPUT_PATH}`,
)
