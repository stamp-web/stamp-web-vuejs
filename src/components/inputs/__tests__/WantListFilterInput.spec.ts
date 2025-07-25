import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import WantListFilterInput from '@/components/inputs/WantListFilterInput.vue'

type WantListFilterInputType = InstanceType<typeof WantListFilterInput> & {
  model: {
    filter: string
  }
}

describe('WantListFilterInput', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper<WantListFilterInputType>

    it('fires wantList-filter-changed on model change', async () => {
      wrapper = mount(WantListFilterInput, {
        props: {
          filter: 'All'
        }
      }) as VueWrapper<WantListFilterInputType>

      wrapper.vm.model.filter = 'WantList'
      await nextTick()
      const chg = wrapper.emitted('wantList-filter-changed')
      expect(chg).toBeTruthy()
      expect(chg?.[0][0]).toBe('WantList')
    })
  })
})
