import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import FilterInput from '@/components/inputs/FilterInput.vue'
import { debounce } from '@/util/timer-utils'

describe('FilterInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('@/util/timer-utils')
    // @ts-ignore
    debounce.mockImplementation((fn) => fn)
  })

  describe('clear()', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      wrapper = mount(FilterInput)
    })

    it('clears and fires filterChanged', async () => {
      // @ts-ignore
      wrapper.vm.model.text = 'temp filter'
      // @ts-ignore
      wrapper.vm.clear()
      // @ts-ignore
      expect(wrapper.vm.model.text).toBe('')
      // We call filterChanged once, but since there is a watch on model.text
      // clearing the text will also invoke it, but we should only get a single
      // debounced call
      expect(debounce).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('filter-changed')).toBeTruthy()
    })
  })
})
