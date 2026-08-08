import type { FilterDraft } from '@/utils/filter-draft/types'

export interface SavedSetup {
  id: string
  name: string
  filterDraft: FilterDraft
}

export interface UseSavedSetupsResult {
  deleteSetup: (setupId: string) => Promise<void>
  errorMessage: string | undefined
  isLoading: boolean
  savedSetups: SavedSetup[]
  saveSetup: (name: string, filterDraft: FilterDraft) => Promise<SavedSetup>
}
