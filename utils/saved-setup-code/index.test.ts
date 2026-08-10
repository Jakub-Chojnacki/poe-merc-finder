import type { SavedSetup } from '@/hooks/use-saved-setups/types'
import { describe, expect, it } from 'vitest'
import {
  exportSavedSetupCode,
  importSavedSetupCode,
} from '.'
import {
  SAVED_SETUP_CODE_ERRORS,
  SAVED_SETUP_CODE_PREFIX,
} from './const'
import { decodeBase64Url, encodeBase64Url } from './utils'

function createSetup(): SavedSetup {
  return {
    id: 'saved-setup-id',
    name: 'Łowca błyskawic ⚡',
    filterDraft: {
      hideFailures: true,
      mercenaryClass: 'Kineticist',
      requirements: [{
        id: 'requirement-id',
        skill: 'Stormcall',
        requiredSupports: ['Spell Echo'],
        optionalSupports: ['Lightning Penetration'],
      }],
    },
  }
}

function createCode(payload: unknown): string {
  return `${SAVED_SETUP_CODE_PREFIX}${encodeBase64Url(JSON.stringify(payload))}`
}

describe('saved setup codes', () => {
  it('round-trips a setup with Unicode text', () => {
    const setup = createSetup()
    const importedSetup = importSavedSetupCode(exportSavedSetupCode(setup))

    expect(importedSetup).toMatchObject({
      name: setup.name,
      filterDraft: {
        hideFailures: true,
        mercenaryClass: 'Kineticist',
        requirements: [{
          skill: 'Stormcall',
          requiredSupports: ['Spell Echo'],
          optionalSupports: ['Lightning Penetration'],
        }],
      },
    })
  })

  it('does not export storage IDs and creates fresh requirement IDs', () => {
    const setup = createSetup()
    const code = exportSavedSetupCode(setup)
    const importedSetup = importSavedSetupCode(code)
    const importedRequirement = importedSetup.filterDraft.requirements[0]!
    const payload = JSON.parse(decodeBase64Url(
      code.slice(SAVED_SETUP_CODE_PREFIX.length),
    ))

    expect(payload).not.toHaveProperty('id')
    expect(payload.filter.requirements[0]).not.toHaveProperty('id')
    expect(importedRequirement.id).not.toBe(
      setup.filterDraft.requirements[0]!.id,
    )
    expect(importedRequirement.id).toBeTruthy()
  })

  it('normalizes duplicate and blank support names on import', () => {
    const setup = createSetup()

    setup.filterDraft.requirements[0]!.requiredSupports = [
      ' Spell Echo ',
      'spell echo',
      '',
    ]

    const importedSetup = importSavedSetupCode(exportSavedSetupCode(setup))

    expect(importedSetup.filterDraft.requirements[0]!.requiredSupports)
      .toEqual(['Spell Echo'])
  })

  it.each([
    ['', SAVED_SETUP_CODE_ERRORS.empty],
    ['not-a-code', SAVED_SETUP_CODE_ERRORS.invalid],
    [`${SAVED_SETUP_CODE_PREFIX}not-base64`, SAVED_SETUP_CODE_ERRORS.invalid],
  ])('rejects invalid code %j', (code, message) => {
    expect(() => importSavedSetupCode(code)).toThrow(message)
  })

  it('rejects unsupported versions', () => {
    expect(() => importSavedSetupCode(createCode({ version: 2 })))
      .toThrow(SAVED_SETUP_CODE_ERRORS.version)
  })

  it('rejects invalid names and filter shapes', () => {
    expect(() => importSavedSetupCode(createCode({
      version: 1,
      name: ' ',
      filter: {},
    }))).toThrow(SAVED_SETUP_CODE_ERRORS.name)

    expect(() => importSavedSetupCode(createCode({
      version: 1,
      name: 'Valid name',
      filter: {},
    }))).toThrow(SAVED_SETUP_CODE_ERRORS.invalid)
  })
})
