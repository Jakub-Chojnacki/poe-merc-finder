export interface SkillRequirement {
  skill: string
  requiredSupports: string[]
  optionalSupports: string[]
}

export interface FilterConfig {
  requirements: SkillRequirement[]
  hideFailures: boolean
}
