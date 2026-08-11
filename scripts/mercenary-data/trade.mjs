import {
  TRADE_SKILL_NAME_OVERRIDES,
  TRADE_SUPPORT_STAT_TEXT_PATTERN,
} from './constants.mjs'

export function parseTradeSupportGems(statGroups) {
  const supportGemsByName = new Map()

  statGroups
    .flatMap(group => group.entries)
    .filter(entry => (
      entry.type === 'mercenary'
      && entry.id.startsWith('mercenary.support_')
    ))
    .forEach((entry) => {
      const match = entry.text.match(TRADE_SUPPORT_STAT_TEXT_PATTERN)

      if (!match) {
        throw new Error(`Could not parse mercenary support stat: ${entry.text}`)
      }

      const name = match[1]
      const tier = Number(match[2])
      const key = `${name}|${tier}`

      supportGemsByName.set(key, {
        name,
        tier,
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

export function parseTradeSkills(statGroups) {
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

  return skills
}
