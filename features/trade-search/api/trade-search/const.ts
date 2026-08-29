export const TRADE_SEARCH_STATUS = 'securable'
export const TRADE_SEARCH_SORT = 'asc'
export const TRADE_SEARCH_PATH_PREFIX = '/trade/search/'
export const TRADE_SEARCH_API_PATH_PREFIX = '/api/trade/search/'

export const TRADE_SEARCH_ERROR_MESSAGES = {
  complexQuery: 'Path of Exile rejected this search as too complex. Log in to Path of Exile and try again, or remove some skill or support filters.',
  empty: 'Add at least one skill before generating a search link.',
  invalidPage: 'Open a Path of Exile trade search before generating a link.',
  malformedResponse: 'Path of Exile returned an invalid search response.',
  requestFailed: 'Path of Exile could not generate the search link.',
  rateLimited: 'Path of Exile is rate limiting searches. Please try again shortly.',
} as const
