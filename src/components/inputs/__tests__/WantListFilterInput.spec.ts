import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import WantListFilterInput from '@/components/inputs/WantListFilterInput.vue'

describe('WantListFilterInput', () => {
  describe('clear()', () => {
    let wrapper: VueWrapper

    it('fires wantList-filter-changed on model change', async () => {
      wrapper = mount(WantListFilterInput, {
        propsData: {
          filter: 'All'
        }
      })
      // @ts-ignore
      wrapper.vm.model.filter = 'WantList'
      await nextTick()
      const chg = wrapper.emitted('wantList-filter-changed')
      expect(chg).toBeTruthy()
      // @ts-ignore
      expect(chg[0][0]).toBe('WantList')
    })
  })
})
