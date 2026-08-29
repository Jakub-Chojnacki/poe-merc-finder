import type { ImportedWarrantFilter } from './types'
import type { SkillRequirementDraft } from '@/features/mercenary-filter/model/filter-draft/types'
import {
  getMercenarySkillOptions,
  getMercenarySupportOptions,
} from '@/shared/mercenary-data'
import { MERCENARY_OPTIONS } from '@/shared/mercenary-data/const'

const WARRANT_NAME = 'Mercenary Warrant'
const SECTION_SEPARATOR_PATTERN = /^\s*-{8,}\s*$/m
const SUPPORT_TIER_PATTERN = /^\(Tier:\s*\d+\)$/i
const INFAMOUS_BUILD_PREFIX_PATTERN = /^infamous\s+/i

export class WarrantImportError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WarrantImportError'
  }
}

function normalizeName(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function findCanonicalName(value: string, names: string[]): string | undefined {
  const normalizedValue = normalizeName(value)

  return names.find(name => normalizeName(name) === normalizedValue)
}

function getSectionLines(section: string): string[] {
  return section
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
}

function isBuildLine(line: string): boolean {
  return line.toLocaleLowerCase().startsWith('build:')
}

export function parseMercenaryWarrant(value: string): ImportedWarrantFilter {
  const sections = value
    .replace(/\r\n?/g, '\n')
    .split(SECTION_SEPARATOR_PATTERN)
    .map(section => section.trim())
    .filter(Boolean)
  const headerLines = getSectionLines(sections[0] ?? '')

  if (
    !headerLines.includes('Item Class: Map Fragments')
    || !headerLines.includes(WARRANT_NAME)
  ) {
    throw new WarrantImportError(
      'This does not look like a copied Mercenary Warrant.',
    )
  }

  const buildSection = sections.find(section => (
    getSectionLines(section).some(line => (
      isBuildLine(line) && line.slice('Build:'.length).trim().length > 0
    ))
  ))
  const buildLine = buildSection
    ? getSectionLines(buildSection).find(
        line => isBuildLine(line) && line.slice('Build:'.length).trim().length > 0,
      )
    : undefined

  const copiedBuild = buildLine?.slice('Build:'.length).trim()

  if (!buildSection || !copiedBuild) {
    throw new WarrantImportError('The warrant does not include a build.')
  }

  const buildSectionIndex = sections.indexOf(buildSection)
  const buildName = copiedBuild.replace(INFAMOUS_BUILD_PREFIX_PATTERN, '')

  const mercenaryClass = findCanonicalName(
    buildName,
    MERCENARY_OPTIONS.map(option => option.name),
  )

  if (!mercenaryClass) {
    throw new WarrantImportError(
      `The mercenary build “${copiedBuild}” is not supported yet.`,
    )
  }

  const skillNames = getMercenarySkillOptions(mercenaryClass).map(
    option => option.name,
  )
  const requirements: SkillRequirementDraft[] = []

  for (const section of sections.slice(buildSectionIndex + 1)) {
    const lines = getSectionLines(section)

    if (
      lines.length === 0
      || lines.some(line => (
        line.startsWith('Right click this item')
        || line.startsWith('Can be used in a personal Map Device')
      ))
    ) {
      break
    }

    const [copiedSkill, ...supportLines] = lines

    if (!copiedSkill) {
      continue
    }

    const skill = findCanonicalName(copiedSkill, skillNames)

    if (!skill) {
      throw new WarrantImportError(
        `The skill “${copiedSkill}” is not available to ${mercenaryClass}.`,
      )
    }

    const supportNames = getMercenarySupportOptions(skill)
    const requiredSupports = supportLines.map((line) => {
      const tierStartIndex = line.lastIndexOf(' (')
      const copiedSupport = tierStartIndex >= 0
        ? line.slice(0, tierStartIndex).trim()
        : ''
      const tier = tierStartIndex >= 0
        ? line.slice(tierStartIndex + 1)
        : ''

      if (!copiedSupport || !SUPPORT_TIER_PATTERN.test(tier)) {
        throw new WarrantImportError(
          `Could not read “${line}” in the ${skill} gem group.`,
        )
      }

      const support = findCanonicalName(copiedSupport, supportNames)

      if (!support) {
        throw new WarrantImportError(
          `The support “${copiedSupport}” is not supported for ${skill}.`,
        )
      }

      return support
    })

    requirements.push({
      id: crypto.randomUUID(),
      skill,
      requiredSupports,
      optionalSupports: [],
    })
  }

  if (requirements.length === 0) {
    throw new WarrantImportError('The warrant does not include any skills.')
  }

  return {
    mercenaryClass,
    requirements,
  }
}
