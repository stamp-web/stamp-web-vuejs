import { describe, it, expect, beforeEach } from 'vitest'
import { isNil, augmentModel } from '../object-utils'

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

  describe('augmentModel', () => {
    let model: Object

    beforeEach(() => {
      model = {
        str: 'test',
        num: 42
      }
    })
    it('adds missing keys of each core type', () => {
      augmentModel(model, {
        obj: { key: 'value' },
        arr: [5, 7, 9]
      })
      // @ts-ignore
      expect(model.obj).toStrictEqual({})
      // @ts-ignore
      expect(model.arr).toStrictEqual([])
    })
  })
})
