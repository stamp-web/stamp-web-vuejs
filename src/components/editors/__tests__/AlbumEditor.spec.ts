import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import AlbumEditor from '@/components/editors/AlbumEditor.vue'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'

describe('AlbumEditor', () => {
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
      wrapper = mount(AlbumEditor, {
        propsData: {
          model: {
            id: 56,
            name: 'test-album'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.title).toBe('Edit Album')
    })

    it('title create scenario', async () => {
      wrapper = mount(AlbumEditor, {
        propsData: {
          model: {}
        }
      })
      // @ts-ignore
      expect(wrapper.vm.title).toBe('New Album')
      await nextTick()
      // @ts-ignore
      expect(wrapper.vm.invalid).toBe(true)
    })
  })
})
