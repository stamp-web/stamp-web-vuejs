import { describe, it, expect } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import GradeSelector from '@/components/inputs/GradeSelector.vue'
import type { ValueRecord } from '@/components/inputs/types/valueRecord'
import { Grade } from '@/models/Grade'

type GradeSelectorType = InstanceType<typeof GradeSelector> & {
  getGrades: () => Promise<ValueRecord<number>[]>
}

describe('GradeSelector', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper<GradeSelectorType> | null = null

    it('Verify values on loading', async () => {
      wrapper = shallowMount(GradeSelector, {
        props: {
          name: 'my-grades',
          appendToBody: false
        }
      }) as unknown as VueWrapper<GradeSelectorType>

      await nextTick()
      const codes = await wrapper.vm.getGrades()
      expect(codes).toBeDefined()
      expect(
        codes.find((e: { name: string }) => {
          return e.name === 'Very-Fine (VF)'
        })
      ).toStrictEqual({ value: Grade.VF, name: 'Very-Fine (VF)' })
    })
  })
})
