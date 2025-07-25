import { describe, expect, it, vi, beforeEach } from 'vitest'
import { OwnershipHelper } from '../Ownership'
import LocalCache from '@/stores/LocalCache'
import type { Preference } from '@/models/Preference'
import { CurrencyCode } from '@/models/CurrencyCode'
import { Condition } from '@/models/Condition'
import { Grade } from '@/models/Grade'

describe('OwnershipHelper tests', () => {
  describe('toTagElementView', () => {
    it('both defects and deception', () => {
      const owner = OwnershipHelper.newInstance()
      owner.defects = 6
      owner.deception = 12
      OwnershipHelper.toTagElementView(owner)
      // @ts-expect-error - _defects is a runtime field from the form
      expect(owner['_defects']).toStrictEqual([4, 2])
      // @ts-expect-error - _deception is a runtime field from the form
      expect(owner['_deception']).toStrictEqual([8, 4])
    })

    it('only defects', () => {
      const owner = OwnershipHelper.newInstance()
      owner.defects = 8
      OwnershipHelper.toTagElementView(owner)
      // @ts-expect-error - _defects is a runtime field from the form
      expect(owner['_defects']).toStrictEqual([8])
      // @ts-expect-error - _deception is a runtime field from the form
      expect(owner['_deception']).toStrictEqual([])
    })

    it('only deception', () => {
      const owner = OwnershipHelper.newInstance()
      owner.deception = 72
      OwnershipHelper.toTagElementView(owner)
      // @ts-expect-error - _defects is a runtime field from the form
      expect(owner['_defects']).toStrictEqual([])
      // @ts-expect-error - _deception is a runtime field from the form
      expect(owner['_deception']).toStrictEqual([64, 8])
    })
  })

  describe('fromTagElementView', () => {
    it('properly converts both', () => {
      const owner = OwnershipHelper.newInstance()
      owner.defects = 0
      owner.deception = 0
      // @ts-expect-error - _defects is a runtime field from the form
      owner._defects = [64, 8]
      // @ts-expect-error - _deception is a runtime field from the form
      owner._deception = [16, 4]
      OwnershipHelper.fromTagElementView(owner)
      expect(owner.defects).toBe(72)
      expect(owner.deception).toBe(20)
      // @ts-expect-error - _deception is a runtime field from the form
      expect(owner._deception).toBeUndefined()
      // @ts-expect-error - _defects is a runtime field from the form
      expect(owner._defects).toBeUndefined()
    })
  })

  describe('newInstance', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.spyOn(LocalCache, 'getItem')
    })

    it('should create a new instance with default values when no preferences provided', () => {
      const ownership = OwnershipHelper.newInstance()
      expect(ownership.id).toBe(0)
      expect(ownership.pricePaid).toBeUndefined()
      expect(ownership.purchased).toBeUndefined()
    })

    it('should set purchased date from LocalCache if available', () => {
      const mockDate = '2025-07-24'
      vi.mocked(LocalCache.getItem).mockReturnValue(mockDate)

      const ownership = OwnershipHelper.newInstance()

      expect(LocalCache.getItem).toHaveBeenCalledWith('ownership-purchased')
      expect(ownership.purchased).toBeInstanceOf(Date)
    })

    it('should apply preferences when provided', () => {
      const preferences: Preference[] = [
        { name: 'albumRef', value: '42' } as Preference,
        { name: 'sellerRef', value: '123' } as Preference,
        { name: 'condition', value: '2' } as Preference,
        { name: 'grade', value: '3' } as Preference,
        { name: 'code', value: CurrencyCode.EUR } as Preference
      ]

      const ownership = OwnershipHelper.newInstance(preferences)

      expect(ownership.albumRef).toBe(42)
      expect(ownership.sellerRef).toBe(123)
      expect(ownership.condition).toBe(Condition.USED)
      expect(ownership.grade).toBe(Grade.F)
      expect(ownership.code).toBe(CurrencyCode.EUR)
    })

    it('should ignore invalid preferences', () => {
      const preferences: Preference[] = [
        { name: 'invalidKey', value: '42' } as Preference,
        { name: 'albumRef', value: '123' } as Preference
      ]

      const ownership = OwnershipHelper.newInstance(preferences)

      expect(ownership.albumRef).toBe(123)
      // @ts-expect-error - Testing that invalid key was not added
      expect(ownership.invalidKey).toBeUndefined()
    })

    it('should handle empty preferences array', () => {
      const ownership = OwnershipHelper.newInstance([])

      expect(ownership.id).toBe(0)
      expect(ownership.pricePaid).toBeUndefined()
      expect(ownership.purchased).toBeUndefined()
    })
  })
})
