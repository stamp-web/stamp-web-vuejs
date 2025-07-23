import { describe, it, expect } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConditionSelector from '@/components/inputs/ConditionSelector.vue'

describe('ConditionSelector', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper

    it('Verify values on loading', async () => {
      wrapper = shallowMount(ConditionSelector, {
        propsData: { name: 'my-condition', appendToBody: false }
      })
      await nextTick()
      // @ts-ignore
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
