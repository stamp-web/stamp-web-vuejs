import { describe, it, expect, vi } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { OwnershipHelper } from '@/models/Ownership'
import { nextTick } from 'vue'
import StampOwnershipForm from '@/components/forms/StampOwnershipForm.vue'

type StampOwnershipFormType = InstanceType<typeof StampOwnershipForm> & {
  regenerateImagePath: () => void
  copyToClipboard: () => void
}
describe('StampOwnershipFrame', () => {
  describe('regenerateImagePath', () => {
    let wrapper: VueWrapper<StampOwnershipFormType>

    it('verify event is raised if there is an image', async () => {
      const owner = OwnershipHelper.newInstance()
      owner.img = 'test country/used/45.png'

      wrapper = shallowMount(StampOwnershipForm, {
        props: {
          modelValue: owner,
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
        }
      }) as VueWrapper<StampOwnershipFormType>
      await nextTick()
      wrapper.vm.regenerateImagePath()
      expect(wrapper.emitted()).toHaveProperty('regenerate-image-path')
    })
  })

  describe('copyToClipboard', () => {
    let wrapper: VueWrapper<StampOwnershipFormType>

    it('verify text is in clipboard buffer', async () => {
      const owner = OwnershipHelper.newInstance()
      owner.img = 'test country/used/44aa.png'

      const mockClipboard = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        writeText: vi.fn().mockImplementation((text: string): Promise<void> => {
          return Promise.resolve()
        })
      }

      Object.defineProperty(global.navigator, 'clipboard', {
        value: mockClipboard,
        writable: true
      })

      wrapper = shallowMount(StampOwnershipForm, {
        props: {
          modelValue: owner,
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
        }
      }) as VueWrapper<StampOwnershipFormType>
      await nextTick()
      wrapper.vm.copyToClipboard()
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test country/used/44aa.png')
    })
  })
})
