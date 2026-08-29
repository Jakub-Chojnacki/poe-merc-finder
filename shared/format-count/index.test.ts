import { describe, expect, it } from 'vitest'
import formatCount from '.'

describe('formatCount', () => {
  it('returns singular form for count 1', () => {
    expect(formatCount(1, 'support')).toBe('1 support')
  })

  it('returns plural form for count higher than 1', () => {
    expect(formatCount(2, 'support')).toBe('2 supports')
    expect(formatCount(5, 'support')).toBe('5 supports')
    expect(formatCount(0, 'support')).toBe('0 supports')
  })

  it('returns plural form for count 0', () => {
    expect(formatCount(0, 'support')).toBe('0 supports')
  })
})
