import { load } from 'cheerio'
import {
  POEDB_BASE_URL,
  POEDB_INTERNAL_SKILL_PREFIX,
  SUPPORT_TIERS_BY_ROMAN_NUMERAL,
} from './constants.mjs'
import { normalizeText } from './shared.mjs'

export function parsePoedbMercenaryUrls(html, mercenaries) {
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

    return new URL(href, POEDB_BASE_URL).href
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
      const tier = SUPPORT_TIERS_BY_ROMAN_NUMERAL[tierLabel]
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

export function addAllowedSupportsToTradeSkills(
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
      if (skill.name.startsWith(POEDB_INTERNAL_SKILL_PREFIX)) {
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
        skills.map((skill) => {
          const tradeSkill = tradeSkillsByName.get(skill.name)

          if (!tradeSkill) {
            throw new Error(
              `Could not match assigned skill to trade metadata: ${skill.name}`,
            )
          }

          return tradeSkill.tradeStatId
        })
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
