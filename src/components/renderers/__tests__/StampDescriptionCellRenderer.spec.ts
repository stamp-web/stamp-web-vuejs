import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import StampDescriptionCellRenderer from '@/components/renderers/StampDescriptionCellRenderer.vue'
import { createInstance } from '@/models/entityModels'
import type { Stamp } from '@/models/Stamp'
describe('StampDescriptionCellRenderer', () => {
  describe('computed', () => {
    it('no stamp', () => {
      const wrapper = shallowMount(StampDescriptionCellRenderer, {
        propsData: {
          params: {
            data: {}
          },
          stamp: createInstance<Stamp>({})
        }
      })
      const vm = wrapper.vm as unknown as typeof StampDescriptionCellRenderer
      expect(vm.stampDescription).toBe('')
    })

    it('stamp without a description', () => {
      const stamp = createInstance<Stamp>({ id: 123, rate: '1d' })
      const wrapper = shallowMount(StampDescriptionCellRenderer, {
        propsData: {
          params: {
            data: stamp
          },
          stamp
        }
      })
      const vm = wrapper.vm as unknown as typeof StampDescriptionCellRenderer
      expect(vm.stampDescription).toBe('1d')
    })

    it('stamp without a rate', () => {
      const stamp = createInstance<Stamp>({ id: 123, description: 'red' })
      const wrapper = shallowMount(StampDescriptionCellRenderer, {
        propsData: {
          params: {
            data: stamp
          },
          stamp
        }
      })
      const vm = wrapper.vm as unknown as typeof StampDescriptionCellRenderer
      expect(vm.stampDescription).toBe('red')
    })

    it('stamp with rate and description', () => {
      const stamp = createInstance<Stamp>({ id: 123, rate: '6d', description: 'red-violet' })
      const wrapper = shallowMount(StampDescriptionCellRenderer, {
        propsData: {
          params: {
            data: stamp
          },
          stamp
        }
      })
      const vm = wrapper.vm as unknown as typeof StampDescriptionCellRenderer
      expect(vm.stampDescription).toBe('6d red-violet')
    })
  })
})
