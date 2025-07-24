import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import CertCellRenderer from '@/components/renderers/CertCellRenderer.vue'
import { createInstance } from '@/models/entityModels'
import type { Stamp } from '@/models/Stamp'

describe('CertCellRenderer', () => {
  describe('computed', () => {
    it('no stamp in row', () => {
      const wrapper = shallowMount(CertCellRenderer, {
        propsData: {
          params: {
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.certIcon).toBeUndefined()
    })

    it('wantList stamp in row', () => {
      const wrapper = shallowMount(CertCellRenderer, {
        propsData: {
          params: {
            data: {
              id: 123,
              wantList: true,
              description: 'red'
            },
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.certIcon).toBeUndefined()
    })

    it('has no certificate', () => {
      const stamp = createInstance<Stamp>({
        id: 456,
        stampOwnerships: [{ id: 123, cert: false }]
      })
      const wrapper = shallowMount(CertCellRenderer, {
        propsData: {
          params: {
            data: stamp,
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.certIcon).toBeUndefined()
    })

    it('has a certificate', () => {
      const stamp = {
        stampOwnerships: [{ id: 123, cert: true }]
      }
      const wrapper = shallowMount(CertCellRenderer, {
        propsData: {
          params: {
            data: stamp,
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.certIcon).toBe('sw-icon-ribbon')
      // @ts-ignore
      expect(wrapper.vm.tooltip).toBe('A certificate or expertization opinion exists')
    })
  })
})
