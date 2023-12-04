import { describe, it, expect } from 'vitest'
import stampCount from '@/components/renderers/formatters/StampCountValueFormatter'
describe('StampCountValueFormatter', () => {
  it('no value object', () => {
    expect(stampCount({})).toBe('')
  })

  it('zero stamps', () => {
    expect(stampCount({ value: 0 })).toBe('')
  })

  it('one stamp', () => {
    expect(stampCount({ value: 1 })).toBe('1 Stamp')
  })

  it('many stamps', () => {
    expect(stampCount({ value: 25400 })).toBe('25400 Stamps')
  })
})
