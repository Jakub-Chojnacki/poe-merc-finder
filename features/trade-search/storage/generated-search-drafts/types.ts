import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'

export interface GeneratedSearchDraft {
  createdAt: number
  filterDraft: FilterDraft
  league: string
  queryId: string
}
