import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConditionFilterInput from '@/components/inputs/ConditionFilterInput.vue'

type ConditionFilterInputType = InstanceType<typeof ConditionFilterInput> & {
  model: {
    condition: string
  }
}

describe('ConditionFilterInput', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper<ConditionFilterInputType>

    it('fires condition-filter-changed on model change', async () => {
      wrapper = mount(ConditionFilterInput, {
        propsData: {
          condition: 'Mint'
        }
      }) as VueWrapper<ConditionFilterInputType>

      wrapper.vm.model.condition = 'Used'
      await nextTick()
      const chg = wrapper.emitted('condition-filter-changed')
      expect(chg).toBeTruthy()
      expect(chg?.[0][0]).toBe('Used')
    })
  })
})
