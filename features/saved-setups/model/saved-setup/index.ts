import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'

export interface SavedSetup {
  id: string
  name: string
  filterDraft: FilterDraft
}
