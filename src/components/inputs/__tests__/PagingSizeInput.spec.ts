import { describe, it, expect } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import PagingSizeInput from '@/components/inputs/PagingSizeInput.vue'
import { nextTick } from 'vue'

describe('PagingSizeInput', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper

    it('fires page-size-changed on model change', async () => {
      wrapper = mount(PagingSizeInput)
      // @ts-ignore
      wrapper.vm.model.pageSize = 100
      await nextTick()
      const chg = wrapper.emitted('page-size-changed')
      expect(chg).toBeTruthy()
      // @ts-ignore
      expect(chg[0][0]).toBe(100)
    })
  })
})
