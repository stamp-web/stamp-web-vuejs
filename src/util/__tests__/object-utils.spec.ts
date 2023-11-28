import { describe, it, expect, beforeEach } from 'vitest'
import { isNil, augmentModel, resolvePath } from '../object-utils'

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
})
