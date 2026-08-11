import {
  POE_WIKI_API_URL,
  REQUEST_HEADERS,
  TRADE_STATS_URL,
} from './constants.mjs'

export async function fetchParsedWikiPage(page) {
  const search = new URLSearchParams({
    action: 'parse',
    format: 'json',
    formatversion: '2',
    page,
    prop: 'text|revid',
  })

  const response = await fetch(`${POE_WIKI_API_URL}?${search}`, {
    headers: REQUEST_HEADERS,
  })

  if (!response.ok) {
    throw new Error(
      `Could not fetch ${page}: ${response.status} ${response.statusText}`,
    )
  }

  const result = await response.json()

  if (!result.parse?.text || typeof result.parse.revid !== 'number') {
    throw new Error(`PoE Wiki returned an unexpected response for ${page}`)
  }

  return result.parse
}

export async function fetchTradeStats() {
  const response = await fetch(TRADE_STATS_URL, {
    headers: REQUEST_HEADERS,
  })

  if (!response.ok) {
    throw new Error(
      `Could not fetch trade stats: ${response.status} ${response.statusText}`,
    )
  }

  const result = await response.json()

  if (!Array.isArray(result.result)) {
    throw new TypeError('Path of Exile returned unexpected trade stats')
  }

  return result.result
}

export async function fetchPoedbPage(url) {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
  })

  if (!response.ok) {
    throw new Error(
      `Could not fetch PoEDB page ${url}: ${response.status} ${response.statusText}`,
    )
  }

  return response.text()
}

export async function fetchBinary(url, description) {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
  })

  if (!response.ok) {
    throw new Error(
      `Could not fetch ${description}: ${response.status} ${response.statusText}`,
    )
  }

  return new Uint8Array(await response.arrayBuffer())
}
