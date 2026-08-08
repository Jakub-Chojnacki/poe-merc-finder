import type { SavedSetup } from './types'

export const SAVED_SETUPS_STORAGE_ITEM = storage.defineItem<SavedSetup[]>(
  'local:savedSetups',
  {
    fallback: [],
    version: 1,
  },
)
