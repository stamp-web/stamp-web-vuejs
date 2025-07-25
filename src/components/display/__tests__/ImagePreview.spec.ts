import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, mount, VueWrapper } from '@vue/test-utils'
import ImagePreview from '../ImagePreview.vue'
import { nextTick } from 'vue'
import bus from 'vue3-eventbus'

// Create proper mock for blueimp-load-image
vi.mock('blueimp-load-image', () => ({
  default: vi.fn()
}))

type ImagePreviewType = InstanceType<typeof ImagePreview> & {
  hasValidImage: boolean
  showingFullImage: boolean
  processImage: () => void
  showFullImage: () => void
  getOptions: () => Record<string, unknown>
  $refs: {
    imgBlock: HTMLDivElement
    fullImage: HTMLDivElement
  }
}

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
      const loadImageMock = (await import('blueimp-load-image')).default as unknown as ReturnType<
        typeof vi.fn
      >
      const wrapper = shallowMount(ImagePreview) as VueWrapper<ImagePreviewType>
      wrapper.vm.processImage()
      expect(loadImageMock).not.toHaveBeenCalled()
    })

    it('valid imageUrl', async () => {
      const imgPath = 'http://test.image-server.com/Pictures/Germany/425.png'
      const imgCmp = document.createElement('img')
      imgCmp.src = imgPath

      const loadImageMock = (await import('blueimp-load-image')).default as unknown as ReturnType<
        typeof vi.fn
      >
      loadImageMock.mockResolvedValue({ image: imgCmp })

      const wrapper = mount(ImagePreview, {
        props: {
          imageUrl: imgPath
        }
      }) as VueWrapper<ImagePreviewType>

      await waitOnDOMUpdate()
      expect(loadImageMock).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.hasValidImage).toBe(true)
      expect(wrapper.vm.$refs.imgBlock.firstElementChild).toBe(imgCmp)
    })

    it('invalid imageUrl with no showNa', async () => {
      const imgPath = 'http://test.image-server.com/Pictures/Germany/425.png'

      const loadImageMock = (await import('blueimp-load-image')).default as unknown as ReturnType<
        typeof vi.fn
      >
      loadImageMock.mockRejectedValue({ value: 'boom' })

      const wrapper = mount(ImagePreview, {
        props: {
          imageUrl: imgPath
        }
      }) as VueWrapper<ImagePreviewType>
      await waitOnDOMUpdate()
      expect(loadImageMock).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.hasValidImage).toBe(false)
    })

    it('invalid imageUrl with showNa set', async () => {
      const imgPath = 'http://test.image-server.com/Pictures/Germany/425.png'
      const imgCmp = document.createElement('img')
      imgCmp.src = 'http://localhost:3000/src/assets/images/not-available.jpg'

      const loadImageMock = (await import('blueimp-load-image')).default as unknown as ReturnType<
        typeof vi.fn
      >
      loadImageMock.mockRejectedValueOnce({ value: 'invalid' }).mockResolvedValue({ image: imgCmp })

      const wrapper = mount(ImagePreview, {
        props: {
          imageUrl: imgPath,
          showNa: true
        }
      }) as VueWrapper<ImagePreviewType>

      await waitOnDOMUpdate(5)
      expect(loadImageMock).toHaveBeenCalledTimes(2)
      expect(wrapper.vm.hasValidImage).toBe(false)

      const divBlock = wrapper.vm.$refs.imgBlock
      expect(divBlock.hasChildNodes()).toBe(true)
      expect(divBlock.firstChild).toBe(imgCmp)
    })
  })

  describe('test watch', () => {
    it('no valid image', async () => {
      const imagePath = 'http://new-imagepath/someimage.png'
      const imgCmp = document.createElement('img')
      imgCmp.src = imagePath

      const loadImageMock = (await import('blueimp-load-image')).default as unknown as ReturnType<
        typeof vi.fn
      >
      loadImageMock.mockResolvedValue({ image: imgCmp })

      const wrapper = mount(ImagePreview) as VueWrapper<ImagePreviewType>
      await waitOnDOMUpdate()
      await wrapper.setProps({ imageUrl: imagePath })
      await waitOnDOMUpdate()
      expect(wrapper.vm.hasValidImage).toBe(true)

      const imgBlock = wrapper.vm.$refs.imgBlock
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
      const wrapper = mount(ImagePreview) as VueWrapper<ImagePreviewType>
      const watcher = vi.fn()
      bus.on('showingImage', watcher)
      wrapper.vm.showFullImage()
      expect(watcher).not.toHaveBeenCalled()
    })

    it('already showing image', async () => {
      const wrapper = mount(ImagePreview) as VueWrapper<ImagePreviewType>
      wrapper.vm.showingFullImage = true
      const watcher = vi.fn()
      bus.on('showingImage', watcher)
      wrapper.vm.showFullImage()
      expect(watcher).not.toHaveBeenCalled()
    })

    it('valid with no full size image', async () => {
      const imagePath = 'http://test-image-path.com/Pictures/Italy/124.jpg'
      const imgCmp = document.createElement('img')
      imgCmp.src = imagePath

      const loadImageMock = (await import('blueimp-load-image')).default as unknown as ReturnType<
        typeof vi.fn
      >
      loadImageMock.mockResolvedValue({ image: imgCmp })

      const wrapper = mount(ImagePreview, {
        props: {
          imageUrl: imagePath
        }
      }) as VueWrapper<ImagePreviewType>
      wrapper.vm.hasValidImage = true
      const watcher = vi.fn()
      bus.on('showingImage', watcher)
      wrapper.vm.showFullImage()
      await waitOnDOMUpdate()
      expect(watcher).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.showingFullImage).toBe(true)
      expect(wrapper.vm.$refs.fullImage.firstChild).toBe(imgCmp)
    })

    it('valid with full size image', async () => {
      const fullImagePath = 'http://test-image-path.com/Pictures/Italy/256.jpg'
      const thumbImagePath = 'http://test-image-path.com/Pictures/Italy/256.jpg'
      const imgCmp = document.createElement('img')
      imgCmp.src = fullImagePath

      const loadImageMock = (await import('blueimp-load-image')).default as unknown as ReturnType<
        typeof vi.fn
      >
      loadImageMock.mockResolvedValue({ image: imgCmp })

      const wrapper = mount(ImagePreview, {
        props: {
          imageUrl: thumbImagePath,
          fullSizeImageUrl: fullImagePath
        }
      }) as VueWrapper<ImagePreviewType>
      wrapper.vm.hasValidImage = true
      const watcher = vi.fn()
      bus.on('showingImage', watcher)
      wrapper.vm.showFullImage()
      await waitOnDOMUpdate()
      expect(watcher).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.showingFullImage).toBe(true)
      const fullImage = wrapper.vm.$refs.fullImage
      expect(fullImage.firstChild).toBe(imgCmp)
      expect((fullImage.firstChild as HTMLImageElement).src).toBe(fullImagePath)
    })
  })

  describe('getOptions', () => {
    it('no options', () => {
      const wrapper = shallowMount(ImagePreview) as VueWrapper<ImagePreviewType>
      const options = wrapper.vm.getOptions()
      expect(options).toStrictEqual({ canvas: true })
    })

    it('with height and width options', () => {
      const wrapper = shallowMount(ImagePreview, {
        props: {
          maxWidth: '400',
          maxHeight: '600'
        }
      }) as VueWrapper<ImagePreviewType>
      const options = wrapper.vm.getOptions()
      expect(options?.maxHeight).toBe(600)
      expect(options?.maxWidth).toBe(400)
    })

    it('only width options', () => {
      const wrapper = shallowMount(ImagePreview, {
        props: {
          maxWidth: '400'
        }
      }) as VueWrapper<ImagePreviewType>
      const options = wrapper.vm.getOptions()
      expect(options?.maxHeight).toBeUndefined()
      expect(options?.maxWidth).toBe(400)
    })

    it('only height options', () => {
      const wrapper = shallowMount(ImagePreview, {
        props: {
          maxHeight: '300'
        }
      }) as VueWrapper<ImagePreviewType>
      const options = wrapper.vm.getOptions()
      expect(options?.maxHeight).toBe(300)
      expect(options?.maxWidth).toBeUndefined()
    })
  })
})
