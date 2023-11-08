import { describe, it, expect } from 'vitest'
import { isNil } from '../object-utils'

describe('object-utils', () => {
  describe('isNil', () => {
    it('verify null', () => {
      expect(isNil(null)).toBe(true)
    })

    it('verify undfined', () => {
      expect(isNil(undefined)).toBe(true)
    })

    it('verify empty object', () => {
      expect(isNil({})).toBe(false)
    })

    it('verify primitive boolean', () => {
      expect(isNil(false)).toBe(false)
    })

    it('verify primitive number', () => {
      expect(isNil(4)).toBe(false)
    })

    it('verify primitive string', () => {
      expect(isNil('test')).toBe(false)
    })
  })
})
