import type { GeneratedSearchDraft } from './types'
import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'
import { getTradeSearchContext } from '@/features/trade-search/api/trade-search'
import {
  GENERATED_SEARCH_DRAFTS_STORAGE_ITEM,
  MAX_GENERATED_SEARCH_DRAFTS,
} from './const'

function hasSearchKey(
  draft: GeneratedSearchDraft,
  league: string,
  queryId: string,
): boolean {
  return draft.league === league && draft.queryId === queryId
}

export async function saveGeneratedSearchDraft(
  league: string,
  queryId: string,
  filterDraft: FilterDraft,
): Promise<void> {
  const currentDrafts = await GENERATED_SEARCH_DRAFTS_STORAGE_ITEM.getValue()
  const generatedDraft: GeneratedSearchDraft = {
    createdAt: Date.now(),
    filterDraft: structuredClone(filterDraft),
    league,
    queryId,
  }
  const nextDrafts = [
    generatedDraft,
    ...currentDrafts.filter(draft => (
      !hasSearchKey(draft, league, queryId)
    )),
  ].slice(0, MAX_GENERATED_SEARCH_DRAFTS)

  await GENERATED_SEARCH_DRAFTS_STORAGE_ITEM.setValue(nextDrafts)
}

export async function getGeneratedSearchDraft(
  pageUrl: string | URL,
): Promise<FilterDraft | undefined> {
  const { league, queryId } = getTradeSearchContext(pageUrl)

  if (!queryId) {
    return
  }

  const drafts = await GENERATED_SEARCH_DRAFTS_STORAGE_ITEM.getValue()
  const generatedDraft = drafts.find(draft => (
    hasSearchKey(draft, league, queryId)
  ))

  return generatedDraft
    ? structuredClone(generatedDraft.filterDraft)
    : undefined
}
