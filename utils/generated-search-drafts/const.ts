import type { GeneratedSearchDraft } from './types'

export const MAX_GENERATED_SEARCH_DRAFTS = 20

export const GENERATED_SEARCH_DRAFTS_STORAGE_ITEM = storage.defineItem<
  GeneratedSearchDraft[]
>(
  'local:generatedSearchDrafts',
  {
    fallback: [],
    version: 1,
  },
)
