import { describe, it, expect, vi } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { OwnershipHelper } from '@/models/Ownership'
import { nextTick } from 'vue'
import StampOwnershipForm from '@/components/forms/StampOwnershipForm.vue'

describe('StampOwnershipFrame', () => {
  describe('regenerateImagePath', () => {
    let wrapper: VueWrapper

    it('verify event is raised if there is an image', async () => {
      const owner = OwnershipHelper.newInstance()
      owner.img = 'test country/used/45.png'

      wrapper = shallowMount(StampOwnershipForm, {
        propsData: {
          modelValue: owner,
          // @ts-ignore
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
        }
      })
      await nextTick()
      // @ts-ignore
      wrapper.vm.regenerateImagePath()
      expect(wrapper.emitted()).toHaveProperty('regenerate-image-path')
    })
  })

  describe('copyToClipboard', () => {
    let wrapper: VueWrapper

    it('verify text is in clipboard buffer', async () => {
      const owner = OwnershipHelper.newInstance()
      owner.img = 'test country/used/44aa.png'
      // @ts-ignore
      global.navigator.clipboard = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        writeText: (s: string) => {}
      } as Clipboard
      const writeText = vi.spyOn(global.navigator.clipboard, 'writeText')

      wrapper = shallowMount(StampOwnershipForm, {
        propsData: {
          modelValue: owner,
          // @ts-ignore
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
        }
      })
      await nextTick()
      // @ts-ignore
      wrapper.vm.copyToClipboard()
      expect(writeText).toHaveBeenCalledWith('test country/used/44aa.png')
    })
  })
})
