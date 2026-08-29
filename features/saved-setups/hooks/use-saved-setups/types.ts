import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'
import type { SavedSetup } from '@/features/saved-setups/model/saved-setup'

export interface UseSavedSetupsResult {
  deleteSetup: (setupId: string) => Promise<void>
  errorMessage: string | undefined
  isLoading: boolean
  savedSetups: SavedSetup[]
  saveSetup: (name: string, filterDraft: FilterDraft) => Promise<SavedSetup>
}
