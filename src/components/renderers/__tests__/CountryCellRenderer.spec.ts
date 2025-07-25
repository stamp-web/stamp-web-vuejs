import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import CountryCellRenderer from '@/components/renderers/CountryCellRenderer.vue'
import { countryStore } from '@/stores/countryStore'
import type { Country } from '@/models/entityModels'

type CountryCellRendererType = InstanceType<typeof CountryCellRenderer> & {
  countries: Country[]
  findCountryName: (id: number) => string
  countryName: string
}

describe('CountryCellRenderer', () => {
  let store = null
  const countryResult = [
    { id: 1, name: 'Germany' },
    { id: 2, name: 'United States' }
  ]
  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
    store = countryStore()
    const spyGetList = vi.spyOn(store, 'find')
    spyGetList.mockImplementation(() => Promise.resolve(countryResult))
  })

  describe('findCountryName tests', () => {
    it('test matching id', () => {
      const wrapper = shallowMount(CountryCellRenderer) as VueWrapper<CountryCellRendererType>
      wrapper.vm.countries = countryResult
      expect(wrapper.vm.findCountryName(2)).toBe('United States')
    })

    it('no matching id', () => {
      const wrapper = shallowMount(CountryCellRenderer) as VueWrapper<CountryCellRendererType>
      wrapper.vm.countries = countryResult
      expect(wrapper.vm.findCountryName(42)).toBe('')
    })
  })

  /**
   * While this essentially tests the same underlying findCollectionName code this will test
   * the parameter handling for the cell renderer value
   */
  describe('collectionName computed property test', () => {
    it('test matching id', () => {
      const comp = shallowMount(CountryCellRenderer, {
        propsData: {
          params: {
            value: 1
          }
        }
      }) as VueWrapper<CountryCellRendererType>
      comp.vm.countries = countryResult
      expect(comp.vm.countryName).toBe('Germany')
    })
  })
})
