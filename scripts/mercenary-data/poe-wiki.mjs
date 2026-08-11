import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { load } from 'cheerio'
import {
  EXPECTED_HOUSES,
  HOUSE_BY_ATTRIBUTE,
  HOUSE_ICON_OUTPUT_DIRECTORY,
  HOUSE_ICON_SOURCE_PATH_PATTERN,
  MERCENARY_CLASS_HEADER_PATTERN,
  POE_WIKI_BASE_URL,
  SUPPORT_COUNT_CODE_PATTERN,
  SUPPORT_COUNTS,
  TRAILING_INFAMOUS_MARKER_PATTERN,
} from './constants.mjs'
import { fetchBinary } from './fetch.mjs'
import { normalizeText } from './shared.mjs'

function parseHouseIcon(activator) {
  const sourcePath = activator.find('img').first().attr('src') ?? ''
  const match = sourcePath.match(HOUSE_ICON_SOURCE_PATH_PATTERN)

  if (!match) {
    return undefined
  }

  const name = match[2]

  return {
    name,
    iconPath: `/icons/houses/${name.toLowerCase()}.png`,
    sourceUrl: new URL(`/images/${match[1]}`, POE_WIKI_BASE_URL).href,
  }
}

function parseSkillCell($, cell, housesByName) {
  const hoverboxes = $(cell).find('.hoverbox').toArray()
  const supportCodes = [
    ...$(cell).text().matchAll(SUPPORT_COUNT_CODE_PATTERN),
  ]

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

export function parseMercenaries(html) {
  const $ = load(html)
  const housesByName = new Map()
  const mercenaries = []

  $('table.wikitable.sortable').each((_, table) => {
    const headerText = normalizeText($(table).find('tr').slice(0, 2).text())

    if (
      !MERCENARY_CLASS_HEADER_PATTERN.test(headerText)
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
      const name = rawName.replace(TRAILING_INFAMOUS_MARKER_PATTERN, '').trim()

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
        skills: {
          primary: parseSkillCell($, cells[classCellIndex + 4], housesByName),
          secondary: parseSkillCell($, cells[classCellIndex + 5], housesByName),
          utility: parseSkillCell($, cells[classCellIndex + 6], housesByName),
        },
      })
    })
  })

  if (mercenaries.length < 30) {
    throw new Error(
      `Expected at least 30 mercenary classes, found ${mercenaries.length}`,
    )
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

export async function writeHouseIcons(houses) {
  const icons = await Promise.all(houses.map(async house => ({
    data: await fetchBinary(house.sourceUrl, `${house.name} house icon`),
    house,
  })))

  await mkdir(HOUSE_ICON_OUTPUT_DIRECTORY, { recursive: true })

  await Promise.all(icons.map(({ data, house }) => (
    writeFile(
      resolve('public', house.iconPath.slice(1)),
      data,
    )
  )))
}
