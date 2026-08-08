import type { FilterDraft, SkillRequirementDraft } from './types'

export function createEmptySkillRequirement(): SkillRequirementDraft {
  return {
    id: crypto.randomUUID(),
    skill: '',
    requiredSupports: '',
    optionalSupports: '',
  }
}

export function createEmptyFilterDraft(): FilterDraft {
  return {
    mercenaryClass: '',
    requirements: [createEmptySkillRequirement()],
    hideFailures: false,
  }
}
