import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import PagingSizeInput from '@/components/inputs/PagingSizeInput.vue'
import { nextTick } from 'vue'

type PagingSizeInputType = InstanceType<typeof PagingSizeInput> & {
  model: {
    pageSize: number
  }
}
describe('PagingSizeInput', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper<PagingSizeInputType>

    it('fires page-size-changed on model change', async () => {
      wrapper = mount(PagingSizeInput) as VueWrapper<PagingSizeInputType>
      wrapper.vm.model.pageSize = 100
      await nextTick()
      const chg = wrapper.emitted('page-size-changed')
      expect(chg).toBeTruthy()
      expect(chg?.[0][0]).toBe(100)
    })
  })
})
