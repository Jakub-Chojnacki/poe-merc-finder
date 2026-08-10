import type { GeneratedSearchDraft } from './types'
import { normalizeFilterDraft } from '@/utils/filter-draft'

export const MAX_GENERATED_SEARCH_DRAFTS = 20

function migrateGeneratedSearchDrafts(value: unknown): GeneratedSearchDraft[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((draft) => {
    if (
      typeof draft !== 'object'
      || draft === null
      || !('league' in draft)
      || typeof draft.league !== 'string'
      || !('queryId' in draft)
      || typeof draft.queryId !== 'string'
    ) {
      return []
    }

    return [{
      createdAt: 'createdAt' in draft && typeof draft.createdAt === 'number'
        ? draft.createdAt
        : Date.now(),
      filterDraft: normalizeFilterDraft(
        'filterDraft' in draft ? draft.filterDraft : undefined,
      ),
      league: draft.league,
      queryId: draft.queryId,
    }]
  })
}

export const GENERATED_SEARCH_DRAFTS_STORAGE_ITEM = storage.defineItem<
  GeneratedSearchDraft[]
>(
  'local:generatedSearchDrafts',
  {
    fallback: [],
    version: 2,
    migrations: {
      2: migrateGeneratedSearchDrafts,
    },
  },
)
