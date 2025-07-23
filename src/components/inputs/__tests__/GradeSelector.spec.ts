import { describe, it, expect } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import GradeSelector from '@/components/inputs/GradeSelector.vue'

describe('GradeSelector', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper

    it('Verify values on loading', async () => {
      wrapper = shallowMount(GradeSelector, {
        propsData: { name: 'my-grades', appendToBody: false }
      })
      await nextTick()
      // @ts-ignore
      const codes = await wrapper.vm.getGrades()
      expect(codes).toBeDefined()
      expect(
        codes.find((e: { name: string }) => {
          return e.name === 'Very-Fine (VF)'
        })
      ).toStrictEqual({ value: 1, name: 'Very-Fine (VF)' })
    })
  })
})
