import { describe, it, expect } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import CurrencySelector from '@/components/inputs/CurrencySelector.vue'

describe('CurrencySelector', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper

    it('Verify values on loading', async () => {
      wrapper = shallowMount(CurrencySelector, {
        propsData: { name: 'my-code', appendToBody: false }
      })
      await nextTick()
      // @ts-ignore
      const codes = await wrapper.vm.getCurrencies()
      expect(codes).toBeDefined()
      expect(codes.length).toBeGreaterThan(0)
      expect(
        codes.findIndex((e: { value: string }) => {
          return e.value === 'EUR'
        })
      ).toBe(4)
    })
  })
})
