import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import DisplayStats from '@/components/display/DisplayStats.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, values: Record<string, number>) => {
      // Simulate i18n translation behavior
      if (key === 'display.total-selected') {
        return `Showing ${values.start}-${values.end} of ${values.total}`
      }
      if (key === 'display.total-selected_zero') {
        return 'No items'
      }
      if (key === 'display.selected-count') {
        return `${values.count} selected`
      }
      return key
    }
  })
}))

describe('DisplayStats.vue', () => {
  it('renders with all props provided', () => {
    const wrapper = mount(DisplayStats, {
      props: {
        total: 100,
        start: 1,
        end: 20,
        selected: 5
      }
    })

    expect(wrapper.text()).toContain('Showing 1-20 of 100')
    expect(wrapper.text()).toContain('5 selected')
  })

  it('renders zero state when total is 0', () => {
    const wrapper = mount(DisplayStats, {
      props: {
        total: 0,
        start: 0,
        end: 0,
        selected: 0
      }
    })

    expect(wrapper.text()).toContain('No items')
    expect(wrapper.text()).toContain('0 selected')
  })

  it('renders with undefined total', () => {
    const wrapper = mount(DisplayStats, {
      props: {
        start: 1,
        end: 20,
        selected: 5
      }
    })

    expect(wrapper.text()).toContain('No items')
    expect(wrapper.text()).toContain('5 selected')
  })

  it('updates display when props change', async () => {
    const wrapper = mount(DisplayStats, {
      props: {
        total: 100,
        start: 1,
        end: 20,
        selected: 5
      }
    })

    // Initial state
    expect(wrapper.text()).toContain('Showing 1-20 of 100')
    expect(wrapper.text()).toContain('5 selected')

    // Update props
    await wrapper.setProps({
      total: 100,
      start: 21,
      end: 40,
      selected: 10
    })

    // Check updated state
    expect(wrapper.text()).toContain('Showing 21-40 of 100')
    expect(wrapper.text()).toContain('10 selected')
  })
})
