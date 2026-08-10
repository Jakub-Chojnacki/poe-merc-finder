export const SAVED_SETUP_CODE_PREFIX = 'PMF1:'
export const SAVED_SETUP_CODE_VERSION = 1
export const SAVED_SETUP_CODE_MAX_LENGTH = 50_000
export const SAVED_SETUP_NAME_MAX_LENGTH = 50

export const SAVED_SETUP_CODE_ERRORS = {
  empty: 'Paste a setup code to import.',
  invalid: 'This is not a valid mercenary setup code.',
  name: 'The imported setup does not have a valid name.',
  tooLong: 'This setup code is too long to import.',
  version: 'This setup code was created by an unsupported version.',
} as const
