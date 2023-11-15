import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterInput from '@/components/inputs/FilterInput.vue'
import debounce from 'lodash-es/debounce'

describe('FilterInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('lodash-es/debounce')
    debounce.mockImplementation((fn) => fn)
  })

  describe('clear()', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = mount(FilterInput)
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
