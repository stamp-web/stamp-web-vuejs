import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import StampDescriptionCellRenderer from '@/components/renderers/StampDescriptionCellRenderer.vue'
describe('StampDescriptionCellRenderer', () => {
  describe('computed', () => {
    it('no stamp', () => {
      const wrapper = shallowMount(StampDescriptionCellRenderer, {
        propsData: {
          params: {}
        }
      })
      // @ts-ignore
      expect(wrapper.vm.stampDescription).toBe('')
    })

    it('stamp without a description', () => {
      const wrapper = shallowMount(StampDescriptionCellRenderer, {
        propsData: {
          params: {
            data: { id: 123, rate: '1d' }
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.stampDescription).toBe('1d')
    })

    it('stamp without a rate', () => {
      const wrapper = shallowMount(StampDescriptionCellRenderer, {
        propsData: {
          params: {
            data: { id: 123, description: 'red' }
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.stampDescription).toBe('red')
    })

    it('stamp with rate and description', () => {
      const wrapper = shallowMount(StampDescriptionCellRenderer, {
        propsData: {
          params: {
            data: { id: 123, rate: '6d', description: 'red-violet' }
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.stampDescription).toBe('6d red-violet')
    })
  })
})
