import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ConditionCellRenderer from '@/components/renderers/ConditionCellRenderer.vue'
describe('ConditionCellRenderer', () => {
  describe('computed', () => {
    it('no stamp in row', () => {
      const wrapper = shallowMount(ConditionCellRenderer, {
        propsData: {
          params: {
            path: 'stampOwnerships[0].condition'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.condition).toBe('')
    })

    it('valid condition', () => {
      const wrapper = shallowMount(ConditionCellRenderer, {
        propsData: {
          params: {
            data: {
              stampOwnerships: [
                {
                  condition: 2
                }
              ]
            },
            path: 'stampOwnerships[0].condition'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.condition).toBe('Used')
    })
  })
})
