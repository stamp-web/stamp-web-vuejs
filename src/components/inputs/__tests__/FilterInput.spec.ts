import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import FilterInput from '@/components/inputs/FilterInput.vue'
import { debounce } from '@/util/timer-utils'

type FilterInputType = InstanceType<typeof FilterInput> & {
  model: {
    text: string
  }
  clear: () => void
}

describe('FilterInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('@/util/timer-utils', () => ({
      debounce: vi.fn((fn) => fn)
    }))
  })

  describe('clear()', () => {
    let wrapper: VueWrapper<FilterInputType>

    beforeEach(async () => {
      wrapper = mount(FilterInput) as VueWrapper<FilterInputType>
    })

    it('clears and fires filterChanged', async () => {
      wrapper.vm.model.text = 'temp filter'
      wrapper.vm.clear()
      expect(wrapper.vm.model.text).toBe('')
      // We call filterChanged once, but since there is a watch on model.text
      // clearing the text will also invoke it, but we should only get a single
      // debounced call
      expect(debounce).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('filter-changed')).toBeTruthy()
    })
  })
})
