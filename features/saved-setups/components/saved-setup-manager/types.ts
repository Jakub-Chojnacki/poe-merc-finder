import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'

export interface SavedSetupManagerProps {
  value: FilterDraft
  onLoad: (filterDraft: FilterDraft) => void
}
