import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { countryStore } from '../../stores/countryStore'
import { mount, VueWrapper } from '@vue/test-utils'
import CountriesView from '@/views/CountriesView.vue'
import ResizeObserver from 'resize-observer-polyfill'

describe('CountriesView', () => {
  global.ResizeObserver = ResizeObserver

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

    vi.mock('vue-router', () => ({
      useRouter: () => ({
        push: vi.fn()
      })
    }))

    wrapper = mount(CountriesView, {
      global: {
        plugins: [pinia]
      }
    })
  })
  it('renders properly', () => {
    expect(wrapper.find('.flex.flex-col').exists()).toBe(true)
  })
})
