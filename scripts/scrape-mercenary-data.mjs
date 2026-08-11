import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { load } from 'cheerio'

const API_URL = 'https://www.poewiki.net/w/api.php'
const POEDB_BASE_URL = 'https://poedb.tw/us/'
const TRADE_STATS_URL = 'https://www.pathofexile.com/api/trade/data/stats'
const POEDB_MERCENARIES_URL = new URL('Mercenaries', POEDB_BASE_URL).href

const MERCENARY_CLASSES_PAGE = 'List of mercenary classes'
const MERCENARY_PAGE = 'Mercenary'
const HOUSE_ICON_OUTPUT_DIRECTORY = resolve('public/icons/houses')
const OUTPUT_PATH = resolve('data/mercenaries.json')

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

// Some skills are named differently on the trade site vs poewiki
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

async function fetchPoedbPage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'PoEMercFinder/0.1 (offline dataset generator)',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Could not fetch PoEDB page ${url}: ${response.status} ${response.statusText}`,
    )
  }

  return response.text()
}

async function mapInBatches(items, batchSize, callback) {
  const results = []

  for (let index = 0; index < items.length; index += batchSize) {
    results.push(...await Promise.all(
      items.slice(index, index + batchSize).map(callback),
    ))
  }

  return results
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

function parsePoedbMercenaryUrls(html, mercenaries) {
  const $ = load(html)

  return mercenaries.map((mercenary) => {
    const matchingLinks = $('a').filter((_, link) => (
      normalizeText($(link).text()) === mercenary.name
    ))

    if (matchingLinks.length !== 1) {
      throw new Error(
        `Expected one PoEDB page for ${mercenary.name}, found ${matchingLinks.length}`,
      )
    }

    const href = matchingLinks.first().attr('href')

    if (!href) {
      throw new Error(`PoEDB page for ${mercenary.name} has no URL`)
    }

    return {
      mercenaryName: mercenary.name,
      url: new URL(href, POEDB_BASE_URL).href,
    }
  })
}

function parsePoedbSkillSupports(html, sourceUrl) {
  const $ = load(html)
  const skills = []

  $('div.border.mb-2').each((_, card) => {
    const name = normalizeText($(card).find('.lc').first().text())
    const supportGrid = $(card).find(
      '.row.row-cols-1.row-cols-lg-3.g-2.bg-dark',
    ).first()

    if (!name || supportGrid.length === 0) {
      return
    }

    const supports = supportGrid.children('.col').map((_, column) => {
      const content = $(column).find('.flex-grow-1.ms-2').first()
      const tierLabel = normalizeText(content.children('span').first().text())
      const tier = { I: 1, II: 2, III: 3 }[tierLabel]
      const nameContent = content.clone()

      nameContent.children('span, .explicitMod').remove()

      const supportName = normalizeText(nameContent.text())

      if (!supportName || !tier) {
        throw new Error(
          `Could not parse a support for ${name} from ${sourceUrl}`,
        )
      }

      return { name: supportName, tier }
    }).get()

    skills.push({ name, supports })
  })

  if (skills.length === 0) {
    throw new Error(`Could not find skill compatibility data at ${sourceUrl}`)
  }

  return skills
}

function addAllowedSupportsToTradeSkills(
  tradeSkills,
  supportGems,
  mercenaries,
  poedbPages,
) {
  const tradeSkillsByName = new Map(
    tradeSkills.flatMap(skill => (
      [skill.name, ...skill.aliases].map(name => [name, skill])
    )),
  )
  const supportGemsByNameAndTier = new Map(
    supportGems.map(support => (
      [`${support.name}|${support.tier}`, support]
    )),
  )
  const supportIdsBySkillId = new Map()

  poedbPages.forEach(({ html, url }) => {
    parsePoedbSkillSupports(html, url).forEach((skill) => {
      if (skill.name.startsWith('[DNT]')) {
        return
      }

      const tradeSkill = tradeSkillsByName.get(skill.name)

      if (!tradeSkill) {
        throw new Error(
          `Could not match PoEDB skill to trade metadata: ${skill.name}`,
        )
      }

      const supportIds = skill.supports.map((support) => {
        const key = `${support.name}|${support.tier}`
        const supportGem = supportGemsByNameAndTier.get(key)

        if (!supportGem) {
          throw new Error(
            `Could not match PoEDB support to trade metadata: ${key}`,
          )
        }

        return supportGem.tradeStatId
      }).sort((left, right) => left.localeCompare(right))
      const existingSupportIds = supportIdsBySkillId.get(tradeSkill.tradeStatId)

      if (
        existingSupportIds
        && JSON.stringify(existingSupportIds) !== JSON.stringify(supportIds)
      ) {
        throw new Error(
          `PoEDB returned conflicting supports for ${tradeSkill.name}`,
        )
      }

      supportIdsBySkillId.set(tradeSkill.tradeStatId, supportIds)
    })
  })

  const assignedSkillIds = new Set(
    mercenaries.flatMap(mercenary => (
      Object.values(mercenary.skills).flatMap(skills => (
        skills.map(skill => skill.tradeStatId)
      ))
    )),
  )
  const missingSkills = tradeSkills.filter(skill => (
    assignedSkillIds.has(skill.tradeStatId)
    && !supportIdsBySkillId.has(skill.tradeStatId)
  ))

  if (missingSkills.length > 0) {
    throw new Error(
      `PoEDB compatibility data is missing assigned skills: ${missingSkills.map(skill => skill.name).join(', ')}`,
    )
  }

  return tradeSkills.map(skill => ({
    ...skill,
    allowedSupportTradeStatIds: supportIdsBySkillId.get(skill.tradeStatId) ?? null,
  }))
}

const [classesPage, mercenaryPage, tradeStatGroups, poedbMercenariesPage] = await Promise.all([
  fetchParsedPage(MERCENARY_CLASSES_PAGE),
  fetchParsedPage(MERCENARY_PAGE),
  fetchTradeStats(),
  fetchPoedbPage(POEDB_MERCENARIES_URL),
])

const exclusiveSupportGems = parseExclusiveSupportGems(mercenaryPage.text)
const tradeSkills = parseTradeSkills(tradeStatGroups)
const parsedMercenaries = parseMercenaries(classesPage.text)
const supportGems = parseTradeSupportGems(tradeStatGroups, exclusiveSupportGems)
const mercenaries = addTradeStatIdsToMercenaries(
  parsedMercenaries.mercenaries,
  tradeSkills,
)
const poedbMercenaryUrls = parsePoedbMercenaryUrls(
  poedbMercenariesPage,
  mercenaries,
)
const poedbPages = await mapInBatches(
  poedbMercenaryUrls,
  5,
  async ({ url }) => ({ url, html: await fetchPoedbPage(url) }),
)
const skills = addAllowedSupportsToTradeSkills(
  tradeSkills,
  supportGems,
  mercenaries,
  poedbPages,
)

await writeHouseIcons(parsedMercenaries.houses)

const dataset = {
  version: 4,
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
    {
      page: 'PoEDB mercenary skill support compatibility',
      revision: null,
      url: POEDB_MERCENARIES_URL,
    },
  ],
  houses: parsedMercenaries.houses,
  mercenaries,
  skills,
  supportGems,
}

await writeFile(OUTPUT_PATH, `${JSON.stringify(dataset, null, 2)}\n`)

console.log(
  `Wrote ${dataset.mercenaries.length} mercenaries, ${dataset.supportGems.length} support gems, ${dataset.skills.filter(skill => skill.allowedSupportTradeStatIds !== null).length} skill support mappings, and ${dataset.houses.length} house icons to ${OUTPUT_PATH}`,
)
