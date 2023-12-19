import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PricePaidCellRenderer from '@/components/renderers/PricePaidCellRenderer.vue'
import { CurrencyCode } from '../../../models/CurrencyCode'
describe('PricePaidCellRenderer', () => {
  describe('computed', () => {
    it('no row object', () => {
      const wrapper = shallowMount(PricePaidCellRenderer, {
        propsData: {
          params: {
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.pricePaid).toBe('')
    })

    it('stamp wantList', () => {
      const wrapper = shallowMount(PricePaidCellRenderer, {
        propsData: {
          params: {
            data: { id: 123, wantList: true },
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.pricePaid).toBe('')
    })

    it('stamp with USD price paid', () => {
      const wrapper = shallowMount(PricePaidCellRenderer, {
        propsData: {
          params: {
            data: {
              id: 123,
              stampOwnerships: [
                {
                  code: CurrencyCode.USD,
                  pricePaid: 45.23
                }
              ]
            },
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.pricePaid).toBe('$45.23')
    })

    it('stamp with no currency but price paid', () => {
      const wrapper = shallowMount(PricePaidCellRenderer, {
        propsData: {
          params: {
            data: {
              id: 123,
              stampOwnerships: [
                {
                  pricePaid: 46.45
                }
              ]
            },
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.pricePaid).toBe('$46.45')
    })

    it('stamp with JPY currency', () => {
      const wrapper = shallowMount(PricePaidCellRenderer, {
        propsData: {
          params: {
            data: {
              id: 123,
              stampOwnerships: [
                {
                  code: CurrencyCode.JPY,
                  pricePaid: 56500
                }
              ]
            },
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.pricePaid).toBe('¥56,500')
    })
  })
})
