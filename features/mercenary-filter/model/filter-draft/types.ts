export interface SkillRequirementDraft {
  id: string
  skill: string
  requiredSupports: string[]
  optionalSupports: string[]
}

export interface FilterDraft {
  mercenaryClass: string
  requirements: SkillRequirementDraft[]
  hideFailures: boolean
}
