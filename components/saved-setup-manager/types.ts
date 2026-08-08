import type { FilterDraft } from '@/utils/filter-draft/types'

export interface SavedSetupManagerProps {
  value: FilterDraft
  onLoad: (filterDraft: FilterDraft) => void
}
