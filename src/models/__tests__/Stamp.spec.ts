import { describe, expect, it } from 'vitest'
import { StampModelHelper } from '@/models/Stamp'
import { Condition } from '@/models/Condition'
import { type Preference } from '@/models/Preference'
import { fail } from 'assert'

describe('StampModelHelper tests', () => {
  describe('newInstance', () => {
    it('simple no preferences for stamp', () => {
      const stamp = StampModelHelper.newInstance(false)
      expect(stamp.id).toBe(0)
      expect(stamp.wantList).toBe(false)
      expect(stamp.activeCatalogueNumber).toBeDefined()
      expect(stamp.catalogueNumbers.length).toBe(1)
      expect(stamp.activeCatalogueNumber?.id).toBe(0)
      expect(stamp.activeCatalogueNumber?.active).toBe(true)
      expect(stamp.stampOwnerships).toBeDefined()
      expect(stamp.stampOwnerships.length).toBe(1)
      expect(stamp.stampOwnerships[0].id).toBe(0)
    })

    it('simple no preferences for wantList', () => {
      const stamp = StampModelHelper.newInstance(true)
      expect(stamp.id).toBe(0)
      expect(stamp.wantList).toBe(true)
      expect(stamp.activeCatalogueNumber).toBeDefined()
      expect(stamp.catalogueNumbers.length).toBe(1)
      expect(stamp.activeCatalogueNumber?.id).toBe(0)
      expect(stamp.activeCatalogueNumber?.active).toBe(true)
      expect(stamp.stampOwnerships).toBeDefined()
      expect(stamp.stampOwnerships.length).toBe(0)
    })

    it('wantlist stamp with preferences', () => {
      const prefs = [{ name: 'countryRef', category: 'stamps', value: '42' } as Preference]
      const stamp = StampModelHelper.newInstance(true, prefs)
      expect(stamp.id).toBe(0)
      expect(stamp.wantList).toBe(true)
      expect(stamp.countryRef).toBe(42)
      expect(stamp.activeCatalogueNumber).toBeDefined()
      expect(stamp.stampOwnerships).toBeDefined()
    })
  })
  describe('calculateImagePath', () => {
    it('verify wantlist does not generate', () => {
      const stamp = StampModelHelper.newInstance(true)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country')).toBe('')
      } else {
        fail('Catalogue number should not be null')
      }
    })

    it('verify with cover bound stamp', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.ON_PAPER
        cn.number = '45a'
        expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country')).toBe(
          'test country/on-cover/45a.jpg'
        )
      } else {
        fail('Catalogue number should not be null')
      }
    })

    it('verify with special characters apostrophe', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.MINT
        cn.number = "45a W OR 5'4'5"
        expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country')).toBe(
          'test country/45a W OR 5-4-5.jpg'
        )
      } else {
        fail('Catalogue number should not be null')
      }
    })

    it('verify stamp with rotary press printing', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.MINT
        cn.number = "21 a W OR 1'4'1/0'5'0"
        expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country')).toBe(
          'test country/21 a W OR 1-4-1_0-5-0.jpg'
        )
      } else {
        fail('Catalogue number should not be null')
      }
    })

    it('verify with special characters', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.USED
        cn.number = '23%`<>"[]{};'
        expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country')).toBe(
          'test country/used/23----------.jpg'
        )
      } else {
        fail('Catalogue number should not be null')
      }
    })

    it('verify with used stamp', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.CTO
        cn.number = '45a'
        expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country', 'mk')).toBe(
          'test country/used/mk45a.jpg'
        )
      } else {
        fail('Catalogue number should not be null')
      }
    })

    it('verify with used stamp but no include used in path', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.CTO
        cn.number = '45a'
        expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country', 'sc', false)).toBe(
          'test country/sc45a.jpg'
        )
      } else {
        fail('Catalogue number should not be null')
      }
    })

    it('preserves existing image file', () => {
      const stamp = StampModelHelper.newInstance(false)
      stamp.stampOwnerships[0].img = 'test/path/someStamp-23.jpg'
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.CTO
        cn.number = '45a'
        expect(
          StampModelHelper.calculateImagePath(stamp, cn, 'test country', 'mk', true, true)
        ).toBe('test country/used/someStamp-23.jpg')
      } else {
        fail('Catalogue number should not be null')
      }
    })
  })
})
