import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import CatalogueValueCellRenderer from '@/components/renderers/CatalogueValueCellRenderer.vue'
import { catalogueStore } from '@/stores/catalogueStore'
import { CurrencyCode } from '@/models/CurrencyCode'
import { Condition } from '@/models/Condition'
import { type Catalogue } from '@/models/Catalogue'
import { type CatalogueNumber } from '@/models/CatalogueNumber'
import { createInstance } from '@/models/entityModels'
import type { Stamp } from '@/models/Stamp'

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
    let comp: VueWrapper<InstanceType<typeof CatalogueValueCellRenderer>>

    beforeEach(() => {
      const cn = createInstance<CatalogueNumber>({
        id: 45,
        active: true,
        catalogueRef: 1,
        value: 15.25,
        condition: Condition.MINT
      })
      const stamp = createInstance<Stamp>({
        id: 15,
        catalogueNumbers: [cn],
        activeCatalogueNumber: cn
      })
      comp = shallowMount(CatalogueValueCellRenderer, {
        propsData: {
          params: {
            data: stamp
          }
        }
      })
      const vm = comp.vm as unknown as { collections: typeof catalogueResult }
      vm.collections = catalogueResult
    })
    it('test matching id', () => {
      const vm = comp.vm as unknown as { catalogueValue: string }
      expect(vm.catalogueValue).toBe('$15.25')
    })
  })
})
