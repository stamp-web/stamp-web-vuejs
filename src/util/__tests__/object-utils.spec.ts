import { describe, it, expect, beforeEach } from 'vitest'
import { AxiosError, type AxiosResponse } from 'axios'
import {
  isNil,
  augmentModel,
  resolvePath,
  EnumHelper,
  determineShiftedValues,
  extractErrorMessage,
  uuidv4,
  fixFraction
} from '@/util/object-utils'
import { Defects } from '@/models/Defects'
import { Deception } from '../../models/Deception'

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
    let model: object

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
      // @ts-expect-error: adding key that was not present
      expect(model.obj).toStrictEqual({})
      // @ts-expect-error: adding key that was not present
      expect(model.arr).toStrictEqual([])
    })

    it('sets missing numbers to 0', () => {
      augmentModel(model, {
        d: 42
      })
      // @ts-expect-error: adding key that was not present
      expect(model.d).toBe(0)
    })

    it('sets missing strings to null', () => {
      augmentModel(model, {
        d: 'foo'
      })
      // @ts-expect-error: adding key that was not present
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
      // @ts-expect-error: adding key that was not present
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
    describe('buildEnumListModel tests', () => {
      it('validate proper creation', () => {
        const en = EnumHelper.buildEnumListModel(Deception, 'deception')
        expect(en).toBeDefined()
        expect(en.length).toBe(8)
        expect(en[1]).toStrictEqual({ value: 4, label: 'Fake Overprint' })
      })
    })
    describe('asEnumArray tests', () => {
      it('empty defects nothing is determined', () => {
        const v = EnumHelper.asEnumArray(Defects, undefined) as string[]
        expect(v).toStrictEqual([])
      })

      it('value for enum is 0', () => {
        const v = EnumHelper.asEnumArray(Defects, 0) as string[]
        expect(v).toStrictEqual([])
      })

      it('single defect is determined', () => {
        let v = EnumHelper.asEnumArray(Defects, Defects.CLIPPED) as string[]
        expect(v.length).toBe(1)
        expect(v[0].toString()).toEqual(Defects.CLIPPED.toString())

        v = EnumHelper.asEnumArray(Defects, Defects.FADING) as string[]
        expect(v.length).toBe(1)
        expect(v[0].toString()).toBe(Defects.FADING.toString())
      })

      it('multiple defects are determined', () => {
        const v = EnumHelper.asEnumArray(
          Defects,
          Defects.CLIPPED + Defects.BLEEDING + Defects.CREASED
        ) as string[]
        expect(v.length).toBe(3)
        expect(v[0]).toBe(Defects.BLEEDING)
        expect(v[1]).toBe(Defects.CLIPPED)
        expect(v[2]).toBe(Defects.CREASED)
      })
    })
  })

  describe('extractErrorMessage', () => {
    it('Plain Error', () => {
      const err = new Error('error unexpected')
      const msg = extractErrorMessage(err)
      expect(msg).toBe('error unexpected')
    })

    it('Reference Error', () => {
      try {
        // @ts-expect-error: Purposely uses an undefined object
        foo.substring(1)
      } catch (err: unknown) {
        const msg = extractErrorMessage(err as Error)
        expect(msg).toBe('foo is not defined')
      }
    })

    it('Axios Error', () => {
      const err = new AxiosError('axios test message', undefined, undefined, undefined, {
        data: 'axios data message'
      } as AxiosResponse)
      const msg = extractErrorMessage(err)
      expect(msg).toBe('axios data message')
    })
  })

  describe('uuidvd', () => {
    it('valid creation', () => {
      const uuid = uuidv4()
      expect(uuid).toBeDefined()
      expect(uuid.length).toBe(36)
    })
  })

  describe('fixFraction', () => {
    it('no fractions', () => {
      expect(fixFraction('452')).toBe(452.0)
    })
    it('not a number', () => {
      expect(fixFraction('foo')).toBe(0)
    })
    it('single decimal place', () => {
      expect(fixFraction('23.5')).toBe(23.5)
    })
    it('two decimal places', () => {
      expect(fixFraction('6700.53')).toBe(6700.53)
    })
    it('four decimal places', () => {
      expect(fixFraction('2345.4501')).toBe(2345.45)
    })
    it('many decimal values truncated to four places', () => {
      expect(fixFraction('3.1415978', 4)).toBe(3.1415)
    })
  })
})
