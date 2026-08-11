import { WHITESPACE_PATTERN } from './constants.mjs'

export function normalizeText(value) {
  return value.replace(WHITESPACE_PATTERN, ' ').trim()
}

export async function mapInBatches(items, batchSize, callback) {
  const results = []

  for (let index = 0; index < items.length; index += batchSize) {
    results.push(...await Promise.all(
      items.slice(index, index + batchSize).map(callback),
    ))
  }

  return results
}
