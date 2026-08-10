import type {
  GeneratedTradeSearchLink,
  GenerateTradeSearchLinkOptions,
  TradeSearchContext,
  TradeSearchRequest,
  TradeSearchResponse,
  TradeStatGroup,
} from './types'
import type { FilterConfig, SkillRequirement } from '@/utils/filter-config/types'
import {
  getMercenarySkillTradeStatId,
  getMercenarySupportTradeStatId,
} from '@/utils/mercenary-data'
import {
  TRADE_SEARCH_API_PATH_PREFIX,
  TRADE_SEARCH_ERROR_MESSAGES,
  TRADE_SEARCH_PATH_PREFIX,
  TRADE_SEARCH_SORT,
  TRADE_SEARCH_STATUS,
} from './const'

export class TradeSearchLinkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TradeSearchLinkError'
  }
}

function createUnknownStatsMessage(names: string[]): string {
  return `No Path of Exile trade stat was found for: ${names.join(', ')}.`
}

function createTradeStatGroup(
  requirement: SkillRequirement,
  unknownNames: string[],
): TradeStatGroup | undefined {
  const skillStatId = getMercenarySkillTradeStatId(requirement.skill)

  if (!skillStatId) {
    unknownNames.push(requirement.skill)
  }

  const supportStatIds = requirement.requiredSupports.map((supportName) => {
    const tradeStatId = getMercenarySupportTradeStatId(supportName)

    if (!tradeStatId) {
      unknownNames.push(supportName)
    }

    return tradeStatId
  })
  const resolvedSupportStatIds = supportStatIds.filter(
    (tradeStatId): tradeStatId is string => tradeStatId !== undefined,
  )

  if (
    !skillStatId
    || resolvedSupportStatIds.length !== supportStatIds.length
  ) {
    return
  }

  return {
    type: 'mercenary',
    value: {
      min: 1 + resolvedSupportStatIds.length,
    },
    filters: [skillStatId, ...resolvedSupportStatIds].map(id => ({ id })),
  }
}

export function createTradeSearchRequest(
  filter: FilterConfig,
): TradeSearchRequest {
  if (filter.requirements.length === 0) {
    throw new TradeSearchLinkError(TRADE_SEARCH_ERROR_MESSAGES.empty)
  }

  const unknownNames: string[] = []
  const stats = filter.requirements
    .map(requirement => createTradeStatGroup(requirement, unknownNames))
    .filter(group => group !== undefined)

  if (unknownNames.length > 0) {
    throw new TradeSearchLinkError(
      createUnknownStatsMessage([...new Set(unknownNames)]),
    )
  }

  return {
    query: {
      status: {
        option: TRADE_SEARCH_STATUS,
      },
      stats,
    },
    sort: {
      price: TRADE_SEARCH_SORT,
    },
  }
}

export function getTradeSearchContext(
  pageUrl: string | URL,
): TradeSearchContext {
  const url = new URL(pageUrl)
  const pathParts = url.pathname.split('/').filter(Boolean)
  const searchIndex = pathParts.findIndex((part, index) => (
    part === 'search' && pathParts[index - 1] === 'trade'
  ))
  const encodedLeague = pathParts[searchIndex + 1]

  if (searchIndex < 0 || !encodedLeague) {
    throw new TradeSearchLinkError(TRADE_SEARCH_ERROR_MESSAGES.invalidPage)
  }

  return {
    league: decodeURIComponent(encodedLeague),
    queryId: pathParts[searchIndex + 2],
  }
}

export function createTradeSearchUrl(
  origin: string,
  league: string,
  queryId: string,
): string {
  return new URL(
    `${TRADE_SEARCH_PATH_PREFIX}${encodeURIComponent(league)}/${encodeURIComponent(queryId)}`,
    origin,
  ).toString()
}

export async function generateTradeSearchLink(
  filter: FilterConfig,
  options: GenerateTradeSearchLinkOptions = {},
): Promise<GeneratedTradeSearchLink> {
  const pageUrl = new URL(options.pageUrl ?? window.location.href)
  const { league } = getTradeSearchContext(pageUrl)
  const request = createTradeSearchRequest(filter)
  const fetchSearch = options.fetch ?? globalThis.fetch
  const endpoint = new URL(
    `${TRADE_SEARCH_API_PATH_PREFIX}${encodeURIComponent(league)}`,
    pageUrl.origin,
  )

  let response: Response

  try {
    response = await fetchSearch(endpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(request),
    })
  }
  catch {
    throw new TradeSearchLinkError(TRADE_SEARCH_ERROR_MESSAGES.requestFailed)
  }

  if (!response.ok) {
    throw new TradeSearchLinkError(
      response.status === 429
        ? TRADE_SEARCH_ERROR_MESSAGES.rateLimited
        : TRADE_SEARCH_ERROR_MESSAGES.requestFailed,
    )
  }

  let result: TradeSearchResponse

  try {
    result = await response.json() as TradeSearchResponse
  }
  catch {
    throw new TradeSearchLinkError(TRADE_SEARCH_ERROR_MESSAGES.malformedResponse)
  }

  if (typeof result.id !== 'string' || !result.id) {
    throw new TradeSearchLinkError(TRADE_SEARCH_ERROR_MESSAGES.malformedResponse)
  }

  return {
    league,
    queryId: result.id,
    url: createTradeSearchUrl(pageUrl.origin, league, result.id),
  }
}
