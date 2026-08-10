import type { FilterDraft, SkillRequirementDraft } from './types'

export function createEmptySkillRequirement(): SkillRequirementDraft {
  return {
    id: crypto.randomUUID(),
    skill: '',
    requiredSupports: [],
    optionalSupports: [],
  }
}

export function createEmptyFilterDraft(): FilterDraft {
  return {
    mercenaryClass: '',
    requirements: [createEmptySkillRequirement()],
    hideFailures: false,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function normalizeGemNames(value: unknown): string[] {
  const names = Array.isArray(value)
    ? value.filter(item => typeof item === 'string')
    : typeof value === 'string' ? value.split(/[\n,]/) : []
  const seenNames = new Set<string>()

  return names.reduce<string[]>((result, name) => {
    const trimmedName = name.trim()
    const normalizedName = trimmedName.toLocaleLowerCase()

    if (trimmedName && !seenNames.has(normalizedName)) {
      seenNames.add(normalizedName)
      result.push(trimmedName)
    }

    return result
  }, [])
}

function normalizeSkillRequirement(value: unknown): SkillRequirementDraft {
  const requirement = isRecord(value) ? value : {}

  return {
    id: typeof requirement.id === 'string'
      ? requirement.id
      : crypto.randomUUID(),
    skill: typeof requirement.skill === 'string' ? requirement.skill : '',
    requiredSupports: normalizeGemNames(requirement.requiredSupports),
    optionalSupports: normalizeGemNames(requirement.optionalSupports),
  }
}

export function normalizeFilterDraft(value: unknown): FilterDraft {
  const draft = isRecord(value) ? value : {}
  const requirements = Array.isArray(draft.requirements)
    ? draft.requirements.map(normalizeSkillRequirement)
    : []

  return {
    mercenaryClass: typeof draft.mercenaryClass === 'string'
      ? draft.mercenaryClass
      : '',
    requirements: requirements.length
      ? requirements
      : [createEmptySkillRequirement()],
    hideFailures: draft.hideFailures === true,
  }
}
