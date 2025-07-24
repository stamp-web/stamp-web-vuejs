import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ButtonGroupModel } from '@/components/buttons/ButtonGroupModel'
import ToggleButtonGroup from '../ToggleButtonGroup.vue'
describe('ToggleButton', () => {
  describe('toggle-changed emitted on click', () => {
    let wrapper: VueWrapper<InstanceType<typeof ToggleButtonGroup>>
    let buttonModels: Array<ButtonGroupModel>

    beforeEach(() => {
      buttonModels = [
        ButtonGroupModel.newInstance('cost', '', true, ''),
        ButtonGroupModel.newInstance('cv', '', false, ''),
        ButtonGroupModel.newInstance('sale', '', false, '')
      ]
      wrapper = mount(ToggleButtonGroup, {
        props: { models: buttonModels }
      })
    })

    it('not toggled with group', async () => {
      await wrapper.findAll('button')[1].trigger('click')
      expect(wrapper.emitted()).toHaveProperty('toggle-changed')
    })
  })
})
