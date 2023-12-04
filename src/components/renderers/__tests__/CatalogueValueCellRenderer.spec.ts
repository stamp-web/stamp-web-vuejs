import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TestContext } from 'vitest'
import { VueWrapper, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import CatalogueValueCellRenderer from '@/components/renderers/CatalogueValueCellRenderer.vue'
import { catalogueStore } from '@/stores/catalogueStore'
import { CurrencyCode } from '@/models/CurrencyCode'
import { Condition } from '@/models/Condition'
import type { Catalogue } from '@/models/entityModels'
import type { ComponentPublicInstance } from 'vue'

describe('StampCollectionCellRenderer', () => {
  let store = null
  const catalogueResult = [
    { id: 1, name: 'cv-1', code: CurrencyCode.USD },
    { id: 2, name: 'cv-2', code: CurrencyCode.EUR }
  ]
  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
    store = catalogueStore()
    const spyGetList = vi.spyOn(store, 'find')
    spyGetList.mockImplementation(() => Promise.resolve(catalogueResult as Catalogue[]))
  })

  /**
   * While this essentially tests the same underlying findCollectionName code this will test
   * the parameter handling for the cell renderer value
   */
  describe('catalogueValue', () => {
    let comp: any

    beforeEach(() => {
      const cn = {
        id: 45,
        active: true,
        catalogueRef: 1,
        value: 15.25,
        condition: Condition.MINT
      }
      comp = shallowMount(CatalogueValueCellRenderer, {
        propsData: {
          params: {
            data: {
              id: 15,
              wantList: true,
              catalogueNumbers: [cn],
              activeCatalogueNumber: cn
            }
          }
        }
      })
      // @ts-ignore
      comp.vm.collections = catalogueResult
    })
    it('test matching id', () => {
      // @ts-ignore
      expect(comp.vm.catalogueValue).toBe('$15.25')
    })
  })
})
