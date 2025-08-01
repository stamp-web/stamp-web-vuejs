import { describe, it, expect } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { StampModelHelper } from '../../../models/Stamp'
import StampDetailsForm from '../StampDetailsForm.vue'

type StampDetailsFormType = InstanceType<typeof StampDetailsForm> & {
  onKeyDown: (event: KeyboardEvent) => void
}

describe('StampDetailsForm', () => {
  describe('onKeyDown', () => {
    let wrapper: VueWrapper<StampDetailsFormType>

    it('verify event is raised on TAB', async () => {
      const stamp = StampModelHelper.newInstance()
      stamp.id = 0

      wrapper = shallowMount(StampDetailsForm, {
        propsData: {
          modelValue: stamp,
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
        }
      })
      await nextTick()
      wrapper.vm.onKeyDown(
        new KeyboardEvent('keydown', {
          key: 'Tab'
        })
      )
      expect(wrapper.emitted()).toHaveProperty('tab-forward')
    })

    it('verify event is not raised on TAB with edit', async () => {
      const stamp = StampModelHelper.newInstance()
      stamp.id = 1000

      wrapper = shallowMount(StampDetailsForm, {
        propsData: {
          modelValue: stamp,
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
        }
      })
      await nextTick()
      wrapper.vm.onKeyDown(
        new KeyboardEvent('keydown', {
          key: 'Tab'
        })
      )
      expect(wrapper.emitted()).not.toHaveProperty('tab-forward')
    })

    it('verify event is not raised without TAB', async () => {
      const stamp = StampModelHelper.newInstance()
      stamp.id = 0

      wrapper = shallowMount(StampDetailsForm, {
        propsData: {
          modelValue: stamp,
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
        }
      })
      await nextTick()
      wrapper.vm.onKeyDown(
        new KeyboardEvent('keydown', {
          key: 'a'
        })
      )
      expect(wrapper.emitted()).not.toHaveProperty('tab-forward')
    })
  })
})
