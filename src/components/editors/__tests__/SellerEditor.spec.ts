import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import SellerEditor from '../SellerEditor.vue'

describe('SellerEditor', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
  })

  describe('computed fields', () => {
    let wrapper: VueWrapper

    it('title edit scenario', async () => {
      wrapper = mount(SellerEditor, {
        propsData: {
          model: {
            id: 56,
            name: 'test-seller'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.title).toBe('Edit Seller')
    })

    it('title create scenario', async () => {
      wrapper = mount(SellerEditor, {
        propsData: {
          model: {}
        }
      })
      // @ts-ignore
      expect(wrapper.vm.title).toBe('New Seller')
      await nextTick()
      // @ts-ignore
      expect(wrapper.vm.invalid).toBe(true)
    })
  })
})
