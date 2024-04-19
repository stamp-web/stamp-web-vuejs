import { describe, it, expect } from 'vitest'
import { type Catalogue, CatalogueModelHelper, CatalogueType } from '@/models/Catalogue'
import { createInstance } from '../entityModels'

describe('CatalogueModelHelper tests', () => {
  describe('getPrefix', () => {
    it('verify Scott prefix', () => {
      const catalogue = createInstance({ type: CatalogueType.SCOTT }) as Catalogue
      expect(CatalogueModelHelper.getPrefix(catalogue)).toBe('sc')
    })

    it('verify default prefix', () => {
      const catalogue = createInstance({ type: CatalogueType.MICHEL }) as Catalogue
      expect(CatalogueModelHelper.getPrefix(catalogue)).toBe('')
    })
  })
})
