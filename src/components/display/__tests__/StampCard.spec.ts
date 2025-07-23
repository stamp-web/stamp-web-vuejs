import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import StampCard from '@/components/display/StampCard.vue'
import { nextTick } from 'vue'
import type { Stamp } from '@/models/Stamp'
import type { Ownership } from '@/models/Ownership'

interface StampCardInstance {
  status: {
    selected: boolean
  }
  toggleSelection: (event?: MouseEvent) => void
  actionClicked: (evt: MouseEvent, action: string) => void
  imageUrl: string | undefined
  fullSizeImage: string | undefined
  observer: IntersectionObserver
}

describe('StampCard', () => {
  describe('toggleSelection', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = shallowMount(StampCard, {
        props: {
          stamp: {
            wantList: true,
            stampOwnerships: [] as Ownership[]
          } as Stamp,
          isSelected: false
        }
      })
    })

    it('verify toggled to selected', () => {
      wrapper.vm.$emit('selected')
      const component = wrapper.vm as unknown as StampCardInstance
      component.toggleSelection()
      expect(wrapper.emitted('selected')).toBeTruthy()
      expect(component.status.selected).toBe(true)
    })

    it('verify toggled to unselected', () => {
      wrapper.vm.$emit('selected')
      const component = wrapper.vm as unknown as StampCardInstance
      component.status.selected = true
      component.toggleSelection()
      expect(wrapper.emitted('deselected')).toBeTruthy()
      expect(component.status.selected).toBe(false)
    })
  })

  describe('actionClicked', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = shallowMount(StampCard, {
        props: {
          stamp: {
            wantList: true,
            stampOwnerships: [] as Ownership[]
          } as Stamp,
          isSelected: false
        }
      })
    })

    it('verify edit action emitted', () => {
      const evt = new MouseEvent('click')
      const component = wrapper.vm as unknown as StampCardInstance
      component.actionClicked(evt, 'edit-stamp')
      expect(wrapper.emitted('edit-stamp')).toBeTruthy()
    })

    it('verify delete action emitted on click', async () => {
      const deleteCmp = wrapper.find('.sw-icon-delete')
      expect(deleteCmp).not.toBeUndefined()
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true })
      deleteCmp.element.dispatchEvent(evt)
      expect(wrapper.emitted('delete-stamp')).toBeTruthy()
    })

    it('verify edit action emitted on click', async () => {
      const deleteCmp = wrapper.find('.sw-icon-edit')
      expect(deleteCmp).not.toBeUndefined()
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true })
      deleteCmp.element.dispatchEvent(evt)
      expect(wrapper.emitted('edit-stamp')).toBeTruthy()
    })
  })

  describe('imageUrl', () => {
    const stamp = {
      wantList: false,
      stampOwnerships: [
        {
          id: 456,
          cert: false,
          img: 'Germany/used/456.png'
        }
      ]
    } as Stamp

    it('valid thumbnail path', () => {
      const comp = shallowMount(StampCard, {
        propsData: {
          stamp: stamp,
          path: 'stampOwnerships[0].img',
          prefPaths: {
            thumbPath: 'https://some-images/Pictures/Thumbnails'
          }
        }
      })
      // @ts-ignore
      expect(comp.vm.imageUrl).toBe(
        'https://some-images/Pictures/Thumbnails/Germany/used/thumb-456.png'
      )
    })

    it('no thumbnail path', () => {
      const comp = shallowMount(StampCard, {
        propsData: {
          stamp: stamp,
          path: 'stampOwnerships[0].img'
        }
      })
      // @ts-ignore
      expect(comp.vm.imageUrl).toBe('/Germany/used/thumb-456.png')
    })
  })

  describe('fullSizeImage', () => {
    const stamp = {
      wantList: false,
      stampOwnerships: [
        {
          id: 456,
          cert: false,
          img: 'Germany/used/456.png'
        }
      ]
    } as Stamp

    it('valid image path', () => {
      const comp = shallowMount(StampCard, {
        propsData: {
          stamp: stamp,
          path: 'stampOwnerships[0].img',
          prefPaths: {
            imagePath: 'https://some-images/Pictures'
          }
        }
      })
      // @ts-ignore
      expect(comp.vm.fullSizeImage).toBe('https://some-images/Pictures/Germany/used/456.png')
    })

    it('no thumbnail path', () => {
      const comp = shallowMount(StampCard, {
        propsData: {
          stamp: stamp,
          path: 'stampOwnerships[0].img'
        }
      })
      // @ts-ignore
      expect(comp.vm.fullSizeImage).toBe('/Germany/used/456.png')
    })
  })

  describe('onUnmounted', () => {
    it('ensure image observer is disconnected', () => {
      const comp = shallowMount(StampCard, {
        propsData: {
          stamp: {
            wantList: false,
            stampOwnerships: [] as Ownership[]
          } as Stamp,
          path: 'stampOwnerships[0].img'
        }
      })
      // @ts-ignore
      const observer = comp.vm.observer
      vi.spyOn(observer, 'disconnect')
      comp.unmount()
      expect(observer.disconnect).toHaveBeenCalled()
    })
  })

  describe('watch', () => {
    it('ensure watch of selected updates', async () => {
      const comp = shallowMount(StampCard, {
        propsData: {
          stamp: {
            wantList: false,
            stampOwnerships: [] as Ownership[]
          } as Stamp,
          isSelected: false
        }
      })
      // @ts-ignore
      expect(comp.vm.status.selected).toBe(false)
      comp.setProps({ isSelected: true })
      await nextTick()
      // @ts-ignore
      expect(comp.vm.status.selected).toBe(true)
    })
  })
})
