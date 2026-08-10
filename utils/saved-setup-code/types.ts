import type { FilterDraft } from '@/utils/filter-draft/types'

export interface SavedSetupCodeRequirement {
  optionalSupports: string[]
  requiredSupports: string[]
  skill: string
}

export interface SavedSetupCodeFilter {
  hideFailures: boolean
  mercenaryClass: string
  requirements: SavedSetupCodeRequirement[]
}

export interface SavedSetupCodePayload {
  filter: SavedSetupCodeFilter
  name: string
  version: number
}

export interface ImportedSavedSetup {
  filterDraft: FilterDraft
  name: string
}
