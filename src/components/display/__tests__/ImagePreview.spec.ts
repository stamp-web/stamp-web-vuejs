import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import ImagePreview from '../ImagePreview.vue'
import { nextTick } from 'vue'
// @ts-ignore
import bus from 'vue3-eventbus'

// consistently wait for 2 DOM updates with the loadImage
const DOM_UPDATES = 2
/**
 * Need to wait N ticks apparently for some DOM updates to show up on the mounted component
 */
async function waitOnDOMUpdate(count: number = DOM_UPDATES) {
  for (let i = 0; i < count; i++) {
    await nextTick()
  }
}
describe('ImagePreview', () => {
  describe('processImage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mock('blueimp-load-image')
    })

    it('empty imageUrl', async () => {
      const img = await import('blueimp-load-image')
      // @ts-ignore
      const fn = (img.default = vi.fn())
      const wrapper = shallowMount(ImagePreview)
      // @ts-ignore
      wrapper.vm.processImage()
      expect(fn).not.toHaveBeenCalled()
    })

    it('valid imageUrl', async () => {
      const img = await import('blueimp-load-image')
      const imgPath = 'http://test.image-server.com/Pictures/Germany/425.png'
      const imgCmp = document.createElement('img')
      imgCmp.src = imgPath
      // @ts-ignore
      const fn = (img.default = vi.fn().mockResolvedValue({
        image: imgCmp
      }))
      const wrapper = mount(ImagePreview, {
        propsData: {
          imageUrl: imgPath
        }
      })

      await waitOnDOMUpdate()
      expect(fn).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(wrapper.vm.hasValidImage).toBe(true)
      // @ts-ignore
      expect(wrapper.vm.$refs.imgBlock.firstElementChild).toBe(imgCmp)
    })

    it('invalid imageUrl with no showNa', async () => {
      const img = await import('blueimp-load-image')
      const imgPath = 'http://test.image-server.com/Pictures/Germany/425.png'
      // @ts-ignore
      const fn = (img.default = vi.fn().mockRejectedValue({ value: 'boom' }))
      const wrapper = await mount(ImagePreview, {
        propsData: {
          imageUrl: imgPath
        }
      })
      await waitOnDOMUpdate()
      expect(fn).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(wrapper.vm.hasValidImage).toBe(false)
    })

    it('invalid imageUrl with showNa set', async () => {
      const img = await import('blueimp-load-image')
      const imgPath = 'http://test.image-server.com/Pictures/Germany/425.png'
      const imgCmp = document.createElement('img')
      imgCmp.src = 'http://localhost:3000/src/assets/images/not-available.jpg'
      // @ts-ignore
      const fn = (img.default = vi
        .fn()
        .mockRejectedValueOnce({ value: 'invalid' })).mockResolvedValue({ image: imgCmp })
      const wrapper = await mount(ImagePreview, {
        propsData: {
          imageUrl: imgPath,
          showNa: true
        }
      })
      // the second loadImage call requires and additional set of waits
      await waitOnDOMUpdate(5)
      expect(fn).toHaveBeenCalledTimes(2)
      // @ts-ignore
      expect(wrapper.vm.hasValidImage).toBe(false)

      const divBlock = wrapper.vm.$refs.imgBlock as HTMLDivElement
      expect(divBlock.hasChildNodes()).toBe(true)
      expect(divBlock.firstChild).toBe(imgCmp)
    })
  })

  describe('test watch', () => {
    it('no valid image', async () => {
      const img = await import('blueimp-load-image')
      const imagePath = 'http://new-imagepath/someimage.png'
      const imgCmp = document.createElement('img')
      imgCmp.src = imagePath
      // @ts-ignore
      img.default = vi.fn().mockResolvedValue({ image: imgCmp })

      const wrapper = await mount(ImagePreview, {
        propsData: {}
      })
      await waitOnDOMUpdate()
      wrapper.setProps({ imageUrl: imagePath })
      await waitOnDOMUpdate()
      // @ts-ignore
      expect(wrapper.vm.hasValidImage).toBe(true)

      const imgBlock = wrapper.vm.$refs.imgBlock as HTMLDivElement
      expect(imgBlock.hasChildNodes()).toBe(true)
      expect(imgBlock.firstChild).toBe(imgCmp)
    })
  })

  describe('showFullImage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mock('blueimp-load-image')
    })

    it('no valid image', async () => {
      const wrapper = await mount(ImagePreview, {
        propsData: {}
      })

      const watcher = vi.fn()
      bus.on('showingImage', watcher)
      // @ts-ignore
      wrapper.vm.showFullImage()
      expect(watcher).not.toHaveBeenCalled()
    })

    it('already showing image', async () => {
      const wrapper = await mount(ImagePreview, {
        propsData: {}
      })
      // @ts-ignore
      wrapper.vm.showingFullImage = true
      const watcher = vi.fn()
      bus.on('showingImage', watcher)
      // @ts-ignore
      wrapper.vm.showFullImage()
      expect(watcher).not.toHaveBeenCalled()
    })

    it('valid with no full size image', async () => {
      const img = await import('blueimp-load-image')
      const imagePath = 'http://test-image-path.com/Pictures/Italy/124.jpg'
      const imgCmp = document.createElement('img')
      imgCmp.src = imagePath
      // @ts-ignore
      img.default = vi.fn().mockResolvedValue({ image: imgCmp })
      const wrapper = await mount(ImagePreview, {
        propsData: {
          imageUrl: imagePath
        }
      })
      // @ts-ignore
      wrapper.vm.hasValidImage = true
      const watcher = vi.fn()
      bus.on('showingImage', watcher)
      // @ts-ignore
      wrapper.vm.showFullImage()
      await waitOnDOMUpdate()
      expect(watcher).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(wrapper.vm.showingFullImage).toBe(true)
      // @ts-ignore
      expect(wrapper.vm.$refs.fullImage.firstChild).toBe(imgCmp)
    })

    it('valid with full size image', async () => {
      const img = await import('blueimp-load-image')
      const fullImagePath = 'http://test-image-path.com/Pictures/Italy/256.jpg'
      const thumbImagePath = 'http://test-image-path.com/Pictures/Italy/256.jpg'
      const imgCmp = document.createElement('img')
      imgCmp.src = fullImagePath
      // @ts-ignore
      img.default = vi.fn().mockResolvedValue({ image: imgCmp })
      const wrapper = await mount(ImagePreview, {
        propsData: {
          imageUrl: thumbImagePath,
          fullSizeImageUrl: fullImagePath
        }
      })
      // @ts-ignore
      wrapper.vm.hasValidImage = true
      const watcher = vi.fn()
      bus.on('showingImage', watcher)
      // @ts-ignore
      wrapper.vm.showFullImage()
      await waitOnDOMUpdate()
      expect(watcher).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(wrapper.vm.showingFullImage).toBe(true)
      // @ts-ignore
      const fullImage = wrapper.vm.$refs.fullImage as HTMLDivElement
      expect(fullImage.firstChild).toBe(imgCmp)
      expect((fullImage.firstChild as HTMLImageElement).src).toBe(fullImagePath)
    })
  })

  describe('getOptions', () => {
    it('no options', () => {
      const wrapper = shallowMount(ImagePreview)
      // @ts-ignore
      const options = wrapper.vm.getOptions()
      expect(options).toStrictEqual({})
    })

    it('with height and width options', () => {
      const wrapper = shallowMount(ImagePreview, {
        propsData: {
          maxWidth: '400',
          maxHeight: '600'
        }
      })
      // @ts-ignore
      const options = wrapper.vm.getOptions()
      expect(options?.maxHeight).toBe(600)
      expect(options?.maxWidth).toBe(400)
    })

    it('only width options', () => {
      const wrapper = shallowMount(ImagePreview, {
        propsData: {
          maxWidth: '400'
        }
      })
      // @ts-ignore
      const options = wrapper.vm.getOptions()
      expect(options?.maxHeight).toBeUndefined()
      expect(options?.maxWidth).toBe(400)
    })

    it('only height options', () => {
      const wrapper = shallowMount(ImagePreview, {
        propsData: {
          maxHeight: '300'
        }
      })
      // @ts-ignore
      const options = wrapper.vm.getOptions()
      expect(options?.maxHeight).toBe(300)
      expect(options?.maxWidth).toBeUndefined()
    })
  })
})
