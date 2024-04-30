import { describe, it, expect } from 'vitest'
import { parseDateString } from '@/util/date-utils'

describe('date-utils', () => {
  describe('parseDateString', () => {
    it('test valid full date', () => {
      const result = parseDateString("datetimeoffset'2024-04-15T04:00:00.000Z'")
      expect(result?.getFullYear()).toBe(2024)
      expect(result?.getMonth()).toBe(3)
      expect(result?.getDate()).toBe(15)
    })

    it('test valid full date without full offset', () => {
      const result = parseDateString("datetimeoffset'2024-04-27T00:00:00'")
      expect(result?.getFullYear()).toBe(2024)
      expect(result?.getMonth()).toBe(3)
      expect(result?.getDate()).toBe(27)
    })

    it('test invalid date', () => {
      const result = parseDateString('this is not valid')
      expect(result).toBeUndefined()
    })
  })
})
