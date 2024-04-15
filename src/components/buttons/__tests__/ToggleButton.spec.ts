import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ToggleButton from '@/components/buttons/ToggleButton.vue'
import { ButtonGroupModel } from '@/components/buttons/ButtonGroupModel'
import { nextTick } from 'vue'
describe('ToggleButton', () => {
  describe('toggledClasses', () => {
    let wrapper: VueWrapper<any, any>
    let buttonModel: ButtonGroupModel

    beforeEach(() => {
      buttonModel = new ButtonGroupModel()
      wrapper = mount(ToggleButton, {
        propsData: { model: buttonModel }
      })
    })

    it('toggled', async () => {
      buttonModel = ButtonGroupModel.newInstance('test is toggled', '', true, '')
      wrapper.setProps({
        model: buttonModel
      })
      await nextTick()
      expect(wrapper.vm.toggledClasses).toBe(' bg-gray-300 ')
    })

    it('not toggled', async () => {
      buttonModel = ButtonGroupModel.newInstance('test not toggled', '', false, '')
      wrapper.setProps({
        model: buttonModel
      })
      await nextTick()
      expect(wrapper.vm.toggledClasses).toBe('')
    })
  })

  describe('clicked', () => {
    let wrapper: VueWrapper<any, any>
    let buttonModel: ButtonGroupModel

    beforeEach(() => {
      buttonModel = new ButtonGroupModel()
      wrapper = mount(ToggleButton, {
        propsData: { model: buttonModel }
      })
    })

    it('toggled with group', async () => {
      buttonModel = ButtonGroupModel.newInstance('click test', '', true, '')
      wrapper.setProps({
        model: buttonModel,
        group: 'btn-group'
      })
      await nextTick()
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()).not.toHaveProperty('toggle-changed')
    })

    it('toggled without group', async () => {
      buttonModel = ButtonGroupModel.newInstance('click test', '', true, '')
      wrapper.setProps({
        model: buttonModel
      })
      await nextTick()
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('toggle-changed')
    })

    it('not toggled with group', async () => {
      buttonModel = ButtonGroupModel.newInstance('click test', '', false, '')
      wrapper.setProps({
        model: buttonModel,
        group: 'btn-group'
      })
      await nextTick()
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('toggle-changed')
    })
  })
})
