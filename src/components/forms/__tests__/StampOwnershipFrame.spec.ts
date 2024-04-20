import { describe, it, expect } from 'vitest'
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
})
