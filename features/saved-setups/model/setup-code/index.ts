import type {
  ImportedSavedSetup,
  SavedSetupCodePayload,
} from './types'
import type { SavedSetup } from '@/features/saved-setups/model/saved-setup'
import { normalizeFilterDraft } from '@/features/mercenary-filter/model/filter-draft'
import {
  SAVED_SETUP_CODE_ERRORS,
  SAVED_SETUP_CODE_MAX_LENGTH,
  SAVED_SETUP_CODE_PREFIX,
  SAVED_SETUP_CODE_VERSION,
  SAVED_SETUP_NAME_MAX_LENGTH,
} from './const'
import {
  decodeBase64Url,
  encodeBase64Url,
  isRecord,
  isSavedSetupCodeFilter,
} from './utils'

export function exportSavedSetupCode(setup: SavedSetup): string {
  const { filterDraft: { hideFailures, mercenaryClass, requirements }, name } = setup

  const payload: SavedSetupCodePayload = {
    filter: {
      hideFailures,
      mercenaryClass,
      requirements: requirements.map(({ optionalSupports, requiredSupports, skill }) => ({
        optionalSupports,
        requiredSupports,
        skill,
      })),
    },
    name,
    version: SAVED_SETUP_CODE_VERSION,
  }

  return `${SAVED_SETUP_CODE_PREFIX}${encodeBase64Url(JSON.stringify(payload))}`
}

export function importSavedSetupCode(code: string): ImportedSavedSetup {
  const trimmedCode = code.trim()

  if (!trimmedCode) {
    throw new Error(SAVED_SETUP_CODE_ERRORS.empty)
  }

  if (trimmedCode.length > SAVED_SETUP_CODE_MAX_LENGTH) {
    throw new Error(SAVED_SETUP_CODE_ERRORS.tooLong)
  }

  if (!trimmedCode.startsWith(SAVED_SETUP_CODE_PREFIX)) {
    throw new Error(SAVED_SETUP_CODE_ERRORS.invalid)
  }

  let payload: unknown

  try {
    payload = JSON.parse(decodeBase64Url(
      trimmedCode.slice(SAVED_SETUP_CODE_PREFIX.length),
    ))
  }
  catch {
    throw new Error(SAVED_SETUP_CODE_ERRORS.invalid)
  }

  if (!isRecord(payload)) {
    throw new Error(SAVED_SETUP_CODE_ERRORS.invalid)
  }

  if (payload.version !== SAVED_SETUP_CODE_VERSION) {
    throw new Error(SAVED_SETUP_CODE_ERRORS.version)
  }

  if (
    typeof payload.name !== 'string'
    || !payload.name.trim()
    || payload.name.trim().length > SAVED_SETUP_NAME_MAX_LENGTH
  ) {
    throw new Error(SAVED_SETUP_CODE_ERRORS.name)
  }

  if (!isSavedSetupCodeFilter(payload.filter)) {
    throw new Error(SAVED_SETUP_CODE_ERRORS.invalid)
  }

  return {
    filterDraft: normalizeFilterDraft({
      ...payload.filter,
      requirements: payload.filter.requirements.map(requirement => ({
        ...requirement,
        id: crypto.randomUUID(),
      })),
    }),
    name: payload.name.trim(),
  }
}
