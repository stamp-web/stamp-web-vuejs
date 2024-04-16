import { describe, it, expect } from 'vitest'

import { setActiveCatalogueNumber } from '@/stores/stampStore'
import { type Stamp } from '@/models/Stamp'
import { type CatalogueNumber } from '@/models/CatalogueNumber'

describe('stampStore', () => {
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
          } as CatalogueNumber
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
          } as CatalogueNumber
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
          } as CatalogueNumber,
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
})
