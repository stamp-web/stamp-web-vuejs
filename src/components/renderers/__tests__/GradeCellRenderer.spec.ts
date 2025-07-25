import { describe, it, expect } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import GradeCellRenderer from '@/components/renderers/GradeCellRenderer.vue'

type GradeCellRendererType = InstanceType<typeof GradeCellRenderer> & {
  grade: string
}

describe('GradeCellRenderer', () => {
  describe('computed', () => {
    it('no stamp in row', () => {
      const wrapper = shallowMount(GradeCellRenderer, {
        propsData: {
          params: {
            path: 'stampOwnerships[0].grade'
          }
        }
      }) as VueWrapper<GradeCellRendererType>
      expect(wrapper.vm.grade).toBe('')
    })

    it('valid grade', () => {
      const wrapper = shallowMount(GradeCellRenderer, {
        propsData: {
          params: {
            data: {
              stampOwnerships: [
                {
                  grade: 2
                }
              ]
            },
            path: 'stampOwnerships[0].grade'
          }
        }
      }) as VueWrapper<GradeCellRendererType>
      expect(wrapper.vm.grade).toBe('Fine-Very-Fine (FVF)')
    })
  })
})
