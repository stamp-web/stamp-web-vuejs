import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
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
      wrapper = shallowMount(AlbumEditor, {
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
      wrapper = shallowMount(AlbumEditor, {
        propsData: {
          model: {
            name: 'another-album'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.title).toBe('New Album')
    })
  })
})
