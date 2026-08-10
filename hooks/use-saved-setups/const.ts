import type { SavedSetup } from './types'
import { normalizeFilterDraft } from '@/utils/filter-draft'

function migrateSavedSetups(value: unknown): SavedSetup[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((setup) => {
    if (
      typeof setup !== 'object'
      || setup === null
      || !('id' in setup)
      || typeof setup.id !== 'string'
      || !('name' in setup)
      || typeof setup.name !== 'string'
    ) {
      return []
    }

    return [{
      id: setup.id,
      name: setup.name,
      filterDraft: normalizeFilterDraft(
        'filterDraft' in setup ? setup.filterDraft : undefined,
      ),
    }]
  })
}

export const SAVED_SETUPS_STORAGE_ITEM = storage.defineItem<SavedSetup[]>(
  'local:savedSetups',
  {
    fallback: [],
    version: 2,
    migrations: {
      2: migrateSavedSetups,
    },
  },
)
