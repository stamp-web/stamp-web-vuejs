import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { countryStore } from '../../stores/countryStore'
import { mount, VueWrapper } from '@vue/test-utils'
import CountriesView from '@/views/CountriesView.vue'
import { createInstance } from '../../models/entityModels'
import type { Country } from '../../models/entityModels'

describe('CountriesView', () => {
  let store = null
  let wrapper: VueWrapper

  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
    store = countryStore()
    const spyGetCountries = vi.spyOn(store, 'find')
    spyGetCountries.mockImplementation(() => Promise.resolve([]))

    wrapper = mount(CountriesView, {
      global: {
        plugins: [pinia]
      }
    })
  })
  it('renders properly', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const c = createInstance<Country>({ id: 5, name: 'test' })
    expect(wrapper.find('.flex.flex-col').exists()).toBe(true)
  })
})
