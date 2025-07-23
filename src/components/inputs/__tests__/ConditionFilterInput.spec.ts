import { describe, it, expect } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConditionFilterInput from '@/components/inputs/ConditionFilterInput.vue'

describe('ConditionFilterInput', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper

    it('fires condition-filter-changed on model change', async () => {
      wrapper = mount(ConditionFilterInput, {
        propsData: {
          condition: 'Mint'
        }
      })
      // @ts-ignore
      wrapper.vm.model.condition = 'Used'
      await nextTick()
      const chg = wrapper.emitted('condition-filter-changed')
      expect(chg).toBeTruthy()
      // @ts-ignore
      expect(chg[0][0]).toBe('Used')
    })
  })
})
