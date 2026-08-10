import type {
  SavedSetupCodeFilter,
  SavedSetupCodeRequirement,
} from './types'

export function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binaryValue = ''

  for (const byte of bytes) {
    binaryValue += String.fromCodePoint(byte)
  }

  return btoa(binaryValue)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
}

export function decodeBase64Url(value: string): string {
  const normalizedValue = value
    .replaceAll('-', '+')
    .replaceAll('_', '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binaryValue = atob(normalizedValue)
  const bytes = Uint8Array.from(
    binaryValue,
    character => character.codePointAt(0) ?? 0,
  )

  return new TextDecoder().decode(bytes)
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

export function isSavedSetupCodeRequirement(
  value: unknown,
): value is SavedSetupCodeRequirement {
  return isRecord(value)
    && typeof value.skill === 'string'
    && isStringArray(value.requiredSupports)
    && isStringArray(value.optionalSupports)
}

export function isSavedSetupCodeFilter(
  value: unknown,
): value is SavedSetupCodeFilter {
  return isRecord(value)
    && typeof value.mercenaryClass === 'string'
    && typeof value.hideFailures === 'boolean'
    && Array.isArray(value.requirements)
    && value.requirements.every(isSavedSetupCodeRequirement)
}
