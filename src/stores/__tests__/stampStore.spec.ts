import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { createFilter, setActiveCatalogueNumber, stampStore } from '@/stores/stampStore'
import { catalogueStore } from '@/stores/catalogueStore'
import { Condition, ConditionHelper } from '@/models/Condition'
import { type Stamp } from '@/models/Stamp'
import { type CatalogueNumber } from '@/models/CatalogueNumber'
import { type SearchOptions } from '@/stores/types/searchOptions'
import { type Catalogue, CatalogueType } from '@/models/Catalogue'
import { CurrencyCode } from '@/models/CurrencyCode'

describe('stampStore', () => {
  vi.mock('@/stores/catalogueStore', () => ({
    catalogueStore: vi.fn()
  }))

  vi.mock('@/services/StampService', () => ({
    default: {
      find: vi.fn(),
      getResourceName: vi.fn().mockReturnValue('stamps'),
      purchase: vi.fn()
    }
  }))

  vi.mock('@/models/Condition', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/models/Condition')>()
    return {
      ...actual, // Keep all original exports
      ConditionHelper: {
        ...actual.ConditionHelper,
        isSameFamily: vi.fn()
      }
    }
  })

  describe('setActiveCatalogueNumber', () => {
    it('Correctly sets active catalogue number', () => {
      const s = {
        id: 444,
        rate: '1d',
        countryRef: 22,
        description: 'test stamp',
        catalogueNumbers: [
          {
            id: 555,
            active: true,
            number: '23a',
            catalogueRef: 5
          } as unknown as CatalogueNumber
        ]
      } as Stamp
      const newStamp = setActiveCatalogueNumber(s)
      expect(newStamp.activeCatalogueNumber).toBeDefined()
      expect(newStamp.activeCatalogueNumber).toEqual(newStamp.catalogueNumbers[0])
    })

    it('No catalogue numbers', () => {
      const s = {
        id: 445,
        rate: '2d',
        countryRef: 22,
        description: 'test stamp'
      } as Stamp
      const newStamp = setActiveCatalogueNumber(s)
      expect(newStamp.activeCatalogueNumber).toBeUndefined()
    })

    it('No active catalogue number', () => {
      const s = {
        id: 446,
        rate: '3d',
        countryRef: 22,
        description: 'test stamp',
        catalogueNumbers: [
          {
            id: 556,
            active: false,
            number: '23b',
            catalogueRef: 5
          } as unknown as CatalogueNumber
        ]
      } as Stamp
      const newStamp = setActiveCatalogueNumber(s)
      expect(newStamp.activeCatalogueNumber).toBeUndefined()
    })

    it('Multiple catalogue numbers with active catalogue number', () => {
      const s = {
        id: 447,
        rate: '4d',
        countryRef: 22,
        description: 'test stamp',
        catalogueNumbers: [
          {
            id: 557,
            active: false,
            number: '23',
            catalogueRef: 5
          } as unknown as CatalogueNumber,
          {
            id: 558,
            active: true,
            number: '56',
            catalogueRef: 12
          }
        ]
      } as Stamp
      const newStamp = setActiveCatalogueNumber(s)
      expect(newStamp.activeCatalogueNumber).toBeDefined()
      expect(newStamp.activeCatalogueNumber?.id).toBe(558)
    })
  })

  describe('createFilter', () => {
    it('should handle numeric catalogue numbers', () => {
      const stamp: Stamp = {
        countryRef: 456
      } as Stamp
      const catalogueNumber: CatalogueNumber = {
        number: '789'
      } as CatalogueNumber

      const result = createFilter(stamp, catalogueNumber) as SearchOptions
      expect(result.$filter).toEqual("((countryRef eq 456) and (number eq '789'))")
    })

    it('should handle alphanumeric catalogue numbers', () => {
      const stamp: Stamp = {
        countryRef: 789
      } as Stamp
      const catalogueNumber: CatalogueNumber = {
        number: 'A123B'
      } as CatalogueNumber

      const result = createFilter(stamp, catalogueNumber) as SearchOptions
      expect(result.$filter).toEqual("((countryRef eq 789) and (number eq 'A123B'))")
    })

    it('should handle special characters in catalogue numbers', () => {
      const stamp: Stamp = {
        countryRef: 101
      } as Stamp
      const catalogueNumber: CatalogueNumber = {
        number: 'A-123-ë'
      } as CatalogueNumber

      const result = createFilter(stamp, catalogueNumber) as SearchOptions
      expect(result.$filter).toEqual("((countryRef eq 101) and (number eq 'A-123-ë'))")
    })
  })

  describe('checkIfExists', () => {
    let store: ReturnType<typeof stampStore>
    let cn: CatalogueNumber
    let stamp: Stamp

    beforeEach(() => {
      setActivePinia(createPinia())
      store = stampStore()
      vi.clearAllMocks()

      cn = { number: '23a', catalogueRef: 2, condition: Condition.MINT_NG } as CatalogueNumber
      stamp = { id: 2, countryRef: 15, catalogueNumbers: [cn], wantList: true } as Stamp
      stamp.activeCatalogueNumber = cn
    })

    it('should return false for invalid stamp id', async () => {
      const s = { id: 1, countryRef: 123 } as Stamp
      const c = { number: '123', catalogueRef: 1, condition: Condition.MINT } as CatalogueNumber

      const result = await store.checkIfExists(s, c)
      expect(result).toBe(false)
    })

    it('should return false for invalid inputs', async () => {
      const invalidCases = [
        {
          // no country
          stamp: { countryRef: 0 } as Stamp,
          cn: { number: '123', catalogueRef: 1, condition: 1 } as CatalogueNumber
        },
        {
          // no number
          stamp: { countryRef: 123 } as Stamp,
          cn: { number: '', catalogueRef: 1, condition: Condition.MINT } as CatalogueNumber
        },
        {
          // no catalogue
          stamp: { countryRef: 123 } as Stamp,
          cn: { number: '123', catalogueRef: 0, condition: Condition.MINT_HH } as CatalogueNumber
        }
      ]

      for (const testCase of invalidCases) {
        const result = await store.checkIfExists(testCase.stamp, testCase.cn)
        expect(result).toBe(false)
      }
    })

    it('should return false when no matching stamps found', async () => {
      const s = { countryRef: 123 } as Stamp
      const c = { number: '123', catalogueRef: 1, condition: Condition.USED } as CatalogueNumber

      vi.spyOn(store, 'find').mockResolvedValue([])

      const result = await store.checkIfExists(s, c)
      expect(result).toBe(false)
    })

    it('should return true for matching stamp with same catalogue type and condition family', async () => {
      const catalogues = [
        {
          id: 2,
          type: CatalogueType.MICHEL,
          name: 'Michel',
          code: CurrencyCode.EUR,
          issue: 2015
        } as Catalogue
      ] as Catalogue[]

      vi.spyOn(store, 'find').mockResolvedValue([stamp])
      vi.mocked(catalogueStore).mockReturnValue({
        find: vi.fn().mockResolvedValue(catalogues)
      } as never)
      vi.mocked(ConditionHelper.isSameFamily).mockReturnValue(true)

      const creatingStamp = Object.assign({}, stamp, { id: 0 }) as Stamp
      const result = await store.checkIfExists(creatingStamp, cn)
      expect(result).toBe(true)
    })

    it('should return false for different catalogue types', async () => {
      const c = {
        id: 5,
        value: '19.50',
        number: '123',
        catalogueRef: 2,
        condition: Condition.MINT,
        type: CatalogueType.SCOTT
      } as unknown as CatalogueNumber
      const s = { countryRef: 123, id: 50, catalogueNumbers: [c], wantList: true } as Stamp
      s.activeCatalogueNumber = c

      const matchingStamp = {
        activeCatalogueNumber: { catalogueRef: 2, condition: Condition.MINT }
      } as Stamp

      const catalogues = [
        { id: 1, type: CatalogueType.SCOTT, issue: 2024, code: CurrencyCode.USD, name: 'Scott' },
        { id: 2, type: CatalogueType.MICHEL, issue: 2015, code: CurrencyCode.EUR, name: 'Michel' }
      ] as Catalogue[]

      vi.spyOn(store, 'find').mockResolvedValue([matchingStamp])
      vi.mocked(catalogueStore).mockReturnValue({
        find: vi.fn().mockResolvedValue(catalogues)
      } as never)

      const result = await store.checkIfExists(stamp, cn)
      expect(result).toBe(false)
    })

    it('should return false when conditions are not in same family', async () => {
      const c = {
        id: 0,
        value: '19.50',
        number: '123',
        catalogueRef: 1,
        condition: Condition.USED,
        type: CatalogueType.MICHEL
      } as unknown as CatalogueNumber
      const s = { countryRef: 123, id: 0, catalogueNumbers: [c], wantList: true } as Stamp
      s.activeCatalogueNumber = c

      const catalogues = [
        { id: 1, type: CatalogueType.MICHEL, name: 'Michel', issue: 2015, code: CurrencyCode.EUR }
      ] as Catalogue[]

      vi.spyOn(store, 'find').mockResolvedValue([stamp])
      vi.mocked(catalogueStore).mockReturnValue({
        find: vi.fn().mockResolvedValue(catalogues)
      } as never)
      vi.mocked(ConditionHelper.isSameFamily).mockReturnValue(false)

      const result = await store.checkIfExists(s, cn)
      expect(result).toBe(false)
    })
  })
})
