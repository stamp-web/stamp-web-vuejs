import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import SellerEditor from '../SellerEditor.vue'
import type { Seller } from '@/models/entityModels'

type SellerEditorType = {
  title: string
  invalid: boolean
  form$: {
    validate: () => void
  }
}

describe('SellerEditor', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
  })

  describe('computed fields', () => {
    let wrapper: VueWrapper<SellerEditorType>

    it('title edit scenario', async () => {
      wrapper = mount(SellerEditor, {
        props: {
          model: {
            id: 56,
            name: 'test-seller'
          } as Seller
        }
      }) as unknown as VueWrapper<SellerEditorType>
      expect(wrapper.vm.title).toBe('Edit Seller')
    })

    it('title create scenario', async () => {
      wrapper = mount(SellerEditor, {
        props: {
          model: {} as Seller
        }
      }) as unknown as VueWrapper<SellerEditorType>
      expect(wrapper.vm.title).toBe('New Seller')
      wrapper.vm.form$.validate()
      await nextTick()
      expect(wrapper.vm.invalid).toBe(true)
    })
  })
})
