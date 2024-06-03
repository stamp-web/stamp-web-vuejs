import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import StampCard from '@/components/display/StampCard.vue'
import { nextTick } from 'vue'

describe('StampCard', () => {
  describe('toggleSelection', () => {
    let comp: VueWrapper<any, any>

    beforeEach(() => {
      comp = shallowMount(StampCard, {
        propsData: {
          stamp: {
            wantList: true,
            stampOwnerships: []
          }
        }
      })
    })
    it('verify toggled to selected', () => {
      comp.vm.toggleSelection()
      expect(comp.emitted('selected')).toBeTruthy()
      expect(comp.vm.status.selected).toBe(true)
    })

    it('verify toggled to unselected', () => {
      comp.vm.status.selected = true
      comp.vm.toggleSelection()
      expect(comp.emitted('deselected')).toBeTruthy()
      expect(comp.vm.status.selected).toBe(false)
    })
  })

  describe('actionClicked', () => {
    let comp: VueWrapper<any, any>

    beforeEach(() => {
      comp = shallowMount(StampCard, {
        propsData: {
          stamp: {
            id: 45,
            wantList: false,
            stampOwnerships: []
          }
        }
      })
    })
    it('verify edit action emitted', () => {
      const evt = new MouseEvent('click')
      comp.vm.actionClicked(evt, 'edit-stamp')
      expect(comp.emitted('edit-stamp')).toBeTruthy()
    })

    it('verify delete action emitted on click', async () => {
      const deleteCmp = comp.find('.sw-icon-delete')
      expect(deleteCmp).not.toBeUndefined()
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true })
      deleteCmp.element.dispatchEvent(evt)
      expect(comp.emitted('delete-stamp')).toBeTruthy()
    })

    it('verify edit action emitted on click', async () => {
      const deleteCmp = comp.find('.sw-icon-edit')
      expect(deleteCmp).not.toBeUndefined()
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true })
      deleteCmp.element.dispatchEvent(evt)
      expect(comp.emitted('edit-stamp')).toBeTruthy()
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
    }

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
    }

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
            stampOwnerships: []
          },
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
            stampOwnerships: []
          },
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
