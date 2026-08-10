import type { FilterConfig } from './types'
import type { FilterDraft } from '@/utils/filter-draft/types'
import { normalizeGemNames } from '@/utils/filter-draft'

export function createFilterConfig(draft: FilterDraft): FilterConfig {
  return {
    requirements: draft.requirements
      .map(requirement => ({
        skill: requirement.skill.trim(),
        requiredSupports: normalizeGemNames(requirement.requiredSupports),
        optionalSupports: normalizeGemNames(requirement.optionalSupports),
      }))
      .filter(requirement => requirement.skill.length > 0),
    hideFailures: draft.hideFailures,
  }
}
