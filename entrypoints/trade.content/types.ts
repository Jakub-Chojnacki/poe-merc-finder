import type { SkillRequirement } from '@/utils/filter-config/types'

export interface MercenarySupport {
  name: string
  element: Element
}

export interface MercenarySkill {
  name: string
  element: Element
  supports: MercenarySupport[]
}

export interface RequirementEvaluation {
  requirement: SkillRequirement
  matchedSkill: MercenarySkill | undefined
  matchedRequiredSupports: MercenarySupport[]
  missingRequiredSupports: string[]
  matchedOptionalSupports: MercenarySupport[]
  missingOptionalSupports: string[]
}

export interface ListingEvaluation {
  status: 'perfect' | 'match' | 'fail'
  requirements: RequirementEvaluation[]
  counts: {
    matchedSkills: number
    totalSkills: number
    matchedRequiredSupports: number
    totalRequiredSupports: number
    matchedOptionalSupports: number
    totalOptionalSupports: number
  }
}
