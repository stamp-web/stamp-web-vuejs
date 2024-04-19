import { describe, expect, it } from 'vitest'
import { StampModelHelper } from '@/models/Stamp'
import { Condition } from '@/models/Condition'
import { type Preference } from '@/models/Preference'

describe('StampModelHelper tests', () => {
  describe('newInstance', () => {
    it('simple no preferences for stamp', () => {
      const stamp = StampModelHelper.newInstance(false)
      expect(stamp.id).toBe(0)
      expect(stamp.wantList).toBe(false)
      expect(stamp.activeCatalogueNumber).toBeDefined()
      expect(stamp.catalogueNumbers.length).toBe(1)
      // @ts-ignore
      expect(stamp.activeCatalogueNumber.id).toBe(0)
      // @ts-ignore
      expect(stamp.activeCatalogueNumber.active).toBe(true)
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
      // @ts-ignore
      expect(stamp.activeCatalogueNumber.id).toBe(0)
      // @ts-ignore
      expect(stamp.activeCatalogueNumber.active).toBe(true)
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
  describe('calculateImagePath ', () => {
    it('verify wantlist does not generate', () => {
      const stamp = StampModelHelper.newInstance(true)
      expect(
        // @ts-ignore
        StampModelHelper.calculateImagePath(stamp, stamp.activeCatalogueNumber, 'test country')
      ).toBe('')
    })

    it('verify with cover bound stamp', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.ON_PAPER
        cn.number = '45a'
      }
      // @ts-ignore
      expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country')).toBe(
        'test country/on-cover/45a.jpg'
      )
    })

    it('verify with used stamp', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.CTO
        cn.number = '45a'
      }
      // @ts-ignore
      expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country', 'mk')).toBe(
        'test country/used/mk45a.jpg'
      )
    })

    it('verify with used stamp but no include used in path', () => {
      const stamp = StampModelHelper.newInstance(false)
      const cn = stamp.activeCatalogueNumber
      if (cn) {
        cn.condition = Condition.CTO
        cn.number = '45a'
      }
      // @ts-ignore
      expect(StampModelHelper.calculateImagePath(stamp, cn, 'test country', 'sc', false)).toBe(
        'test country/sc45a.jpg'
      )
    })
  })
})
