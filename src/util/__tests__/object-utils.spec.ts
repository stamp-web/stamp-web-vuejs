import { describe, it, expect, beforeEach } from 'vitest'
import {
  isNil,
  augmentModel,
  resolvePath,
  EnumHelper,
  determineShiftedValues,
  asCurrencyString
} from '../object-utils'
import { Defects } from '@/models/Defects'
import { CurrencyCode } from '../../models/CurrencyCode'

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

    it('sets missing numbers to 0', () => {
      augmentModel(model, {
        d: 42
      })
      // @ts-ignore
      expect(model.d).toBe(0)
    })

    it('sets missing strings to null', () => {
      augmentModel(model, {
        d: 'foo'
      })
      // @ts-ignore
      expect(model.d).toBe(null)
    })

    it('adds missing keys of each child object', () => {
      const m = {
        id: 10,
        a: [
          { b: 'val', id: 20 },
          { b: 'foo', id: 21 }
        ]
      }
      augmentModel(m, {
        d: [
          { c: 'val', id: 20 },
          { c: 'bar', id: 21 }
        ]
      })
      // @ts-ignore
      expect(m.d).toStrictEqual([])
    })
  })

  describe('resolvePath', () => {
    it('simple path resolution', () => {
      const s = { a: 'foo' }
      expect(resolvePath(s, 'a')).toBe('foo')
    })
    it('simple path resolution and traversal', () => {
      const s = { a: { b: 'baz' } }
      expect(resolvePath(s, 'a.b')).toBe('baz')
    })
    it('invalid path resolution with default', () => {
      const s = { a: { b: 'baz' } }
      expect(resolvePath(s, 'a.c', 'default')).toBe('default')
    })
    it('invalid path resolution', () => {
      const s = { a: { b: 'baz' } }
      expect(resolvePath(s, 'a.c')).toBe(undefined)
    })
    it('resolves array content property', () => {
      const s = { a: [{ b: 12 }, { b: 14 }] }
      expect(resolvePath(s, 'a[1].b')).toBe(14)
    })
    it('resolves array content index out of bounds', () => {
      const s = { a: [{ b: 12 }, { b: 14 }] }
      expect(resolvePath(s, 'a[3].b')).toBe(undefined)
    })
    it('resolves array content index out of bounds with default', () => {
      const s = { a: [{ b: 12 }, { b: 14 }] }
      expect(resolvePath(s, 'a[3].b', 42)).toBe(42)
    })
    it('resolves deep array content', () => {
      const s = { a: [{ b: [{ c: [{ d: 42 }] }] }] }
      expect(resolvePath(s, 'a[0].b[0].c[0].d', 89)).toBe(42)
    })
  })

  describe('asCurrencyString', () => {
    it('USD simple value', () => {
      const v = asCurrencyString(43.52, CurrencyCode.USD)
      expect(v).toBe('$43.52')
    })

    it('USD larger value', () => {
      const v = asCurrencyString(25043.52, CurrencyCode.USD)
      expect(v).toBe('$25,043.52')
    })

    it('EUR simple value', () => {
      const v = asCurrencyString(53.0, CurrencyCode.EUR)
      expect(v).toBe('€53.00')
    })

    it('JPY simple value', () => {
      const v = asCurrencyString(100542, CurrencyCode.JPY)
      expect(v).toBe('¥100,542')
    })
  })

  describe('determineShiftedValues', () => {
    it('single value', () => {
      const v = determineShiftedValues(32, 6)
      expect(v.length).toBe(1)
      expect(v[0]).toBe(32)
    })

    it('multiple values', () => {
      const v = determineShiftedValues(38, 6)
      expect(v.length).toBe(3)
      expect(v[0]).toBe(32)
      expect(v[1]).toBe(4)
      expect(v[2]).toBe(2)
    })
  })

  describe('EnumHelper', () => {
    describe('asEnumArray tests', () => {
      it('empty defects nothing is determined', () => {
        // @ts-ignore
        const v = EnumHelper.asEnumArray(Defects, undefined)
        expect(v).toStrictEqual([])
      })

      it('value for enum is 0', () => {
        // @ts-ignore
        const v = EnumHelper.asEnumArray(Defects, 0)
        expect(v).toStrictEqual([])
      })

      it('single defect is determined', () => {
        let v = EnumHelper.asEnumArray(Defects, Defects.CLIPPED)
        expect(v.length).toBe(1)
        expect(v[0].toString()).toEqual(Defects.CLIPPED.toString())

        v = EnumHelper.asEnumArray(Defects, Defects.FADING)
        expect(v.length).toBe(1)
        expect(v[0].toString()).toBe(Defects.FADING.toString())
      })

      it('multiple defects are determined', () => {
        const v = EnumHelper.asEnumArray(
          Defects,
          Defects.CLIPPED + Defects.BLEEDING + Defects.CREASED
        )
        expect(v.length).toBe(3)
        expect(v[0]).toBe(Defects.BLEEDING)
        expect(v[1]).toBe(Defects.CLIPPED)
        expect(v[2]).toBe(Defects.CREASED)
      })
    })
  })
})
