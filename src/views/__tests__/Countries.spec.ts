import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { modelStore } from '../../stores/modelStore'
import { mount, VueWrapper } from '@vue/test-utils'
import Countries from '@/views/Countries.vue'
import { createInstance } from '../../models/entityModels'
import type { Country } from '../../models/entityModels'

describe('Countries', () => {
  let store = null
  let wrapper: VueWrapper

  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
    store = modelStore()
    const spyGetCountries = vi.spyOn(store, 'getCountries')
    spyGetCountries.mockImplementation(() => Promise.resolve([]))

    wrapper = mount(Countries, {
      global: {
        plugins: [pinia]
      }
    })
  })
  it('renders properly', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const c = createInstance<Country>({ id: 5, name: 'test' })
    expect(wrapper.find('.country-list-pane').exists()).toBe(true)
  })
})
