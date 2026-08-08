import type { FilterConfig } from './types'
import type { FilterDraft } from '@/utils/filter-draft/types'

function parseGemList(value: string): string[] {
  return [...new Set(
    value
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(Boolean),
  )]
}

export function createFilterConfig(draft: FilterDraft): FilterConfig {
  return {
    requirements: draft.requirements
      .map(requirement => ({
        skill: requirement.skill.trim(),
        requiredSupports: parseGemList(requirement.requiredSupports),
        optionalSupports: parseGemList(requirement.optionalSupports),
      }))
      .filter(requirement => requirement.skill.length > 0),
    hideFailures: draft.hideFailures,
  }
}
