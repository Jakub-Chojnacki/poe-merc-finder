export interface SkillRequirementDraft {
  id: string
  skill: string
  requiredSupports: string
  optionalSupports: string
}

export interface FilterDraft {
  requirements: SkillRequirementDraft[]
  hideFailures: boolean
}
