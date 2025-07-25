import { describe, it, expect } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import CurrencySelector from '@/components/inputs/CurrencySelector.vue'
import type { ValueRecord } from '@/components/inputs/types/valueRecord'
import { CurrencyCode } from '@/models/CurrencyCode'

type CurrencySelectorType = InstanceType<typeof CurrencySelector> & {
  getCurrencies: () => Promise<ValueRecord<string>[]>
}

describe('CurrencySelector', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper<CurrencySelectorType>

    it('Verify values on loading', async () => {
      wrapper = shallowMount(CurrencySelector, {
        propsData: { name: 'my-code', appendToBody: false }
      }) as VueWrapper<CurrencySelectorType>
      await nextTick()
      const codes = await wrapper.vm.getCurrencies()
      expect(codes).toBeDefined()
      expect(codes.length).toBeGreaterThan(0)
      expect(
        codes.findIndex((e) => e.value === CurrencyCode.EUR) // Using enum value
      ).toBe(4)
    })
  })
})
