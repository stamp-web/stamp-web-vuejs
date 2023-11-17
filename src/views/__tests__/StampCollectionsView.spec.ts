import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { mount, VueWrapper } from '@vue/test-utils'
import StampCollectionsView from '@/views/StampCollectionsView.vue'
import { stampCollectionStore } from '../../stores/stampCollectionStore'
import ResizeObserver from 'resize-observer-polyfill'

describe('StampCollectionsView', () => {
  global.ResizeObserver = ResizeObserver

  let store = null
  let wrapper: VueWrapper

  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
    store = stampCollectionStore()
    const spyGetList = vi.spyOn(store, 'find')
    spyGetList.mockImplementation(() => Promise.resolve([]))

    wrapper = mount(StampCollectionsView, {
      global: {
        plugins: [pinia]
      }
    })
  })
  it('renders properly', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(wrapper.find('.flex.flex-col').exists()).toBe(true)
  })
})
