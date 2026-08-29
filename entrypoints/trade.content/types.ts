import type { SkillRequirement } from '@/features/mercenary-filter/model/filter-config/types'

export type ListingStatus = 'perfect' | 'match' | 'fail'

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

export interface SupportNameEvaluation {
  matched: MercenarySupport[]
  missing: string[]
}

export interface ListingCounts {
  matchedSkills: number
  totalSkills: number
  matchedRequiredSupports: number
  totalRequiredSupports: number
  matchedOptionalSupports: number
  totalOptionalSupports: number
}

export interface ListingEvaluation {
  status: ListingStatus
  requirements: RequirementEvaluation[]
  counts: ListingCounts
}
