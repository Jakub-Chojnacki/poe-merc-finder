import type { FilterDraft } from '@/utils/filter-draft/types'

export interface GeneratedSearchDraft {
  createdAt: number
  filterDraft: FilterDraft
  league: string
  queryId: string
}
