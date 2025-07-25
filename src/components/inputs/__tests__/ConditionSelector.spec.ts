import { describe, it, expect } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConditionSelector from '@/components/inputs/ConditionSelector.vue'
import type { ValueRecord } from '@/components/inputs/types/valueRecord'

type ConditionSelectorType = InstanceType<typeof ConditionSelector> & {
  getConditions: () => Promise<ValueRecord<number>[]>
}

describe('ConditionSelector', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper<ConditionSelectorType>

    it('Verify values on loading', async () => {
      wrapper = shallowMount(ConditionSelector, {
        propsData: { name: 'my-condition', appendToBody: false }
      }) as unknown as VueWrapper<ConditionSelectorType>
      await nextTick()
      const codes = await wrapper.vm.getConditions()
      expect(codes).toBeDefined()
      expect(
        codes.find((e: { name: string }) => {
          return e.name === 'Used'
        })
      ).toStrictEqual({ value: 2, name: 'Used' })
    })
  })
})
