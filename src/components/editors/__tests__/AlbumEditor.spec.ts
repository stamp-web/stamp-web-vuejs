import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount, VueWrapper } from '@vue/test-utils'
import AlbumEditor from '@/components/editors/AlbumEditor.vue'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import type { Album } from '@/models/entityModels'

type AlbumEditorType = {
  title: string
  invalid: boolean
}
describe('AlbumEditor', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
  })

  describe('computed fields', () => {
    let wrapper: VueWrapper<AlbumEditorType>

    it('title edit scenario', async () => {
      wrapper = mount(AlbumEditor, {
        props: {
          model: {
            id: 56,
            name: 'test-album'
          } as Album
        }
      }) as unknown as VueWrapper<AlbumEditorType>
      await nextTick()
      expect(wrapper.vm.title).toBe('Edit Album')
    })

    it('title create scenario', async () => {
      wrapper = mount(AlbumEditor, {
        props: {
          model: {} as Album
        }
      }) as unknown as VueWrapper<AlbumEditorType>
      expect(wrapper.vm.title).toBe('New Album')
      await nextTick()
      expect(wrapper.vm.invalid).toBe(true)
    })
  })
})
