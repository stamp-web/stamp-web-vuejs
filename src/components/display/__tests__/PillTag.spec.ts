import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PillTag from '@/components/display/PillTag.vue'

describe('PillTag.vue', () => {
  it('renders value prop correctly', () => {
    const wrapper = mount(PillTag, {
      props: {
        value: 'Test Pill'
      }
    })
    expect(wrapper.text()).toBe('Test Pill')
  })

  it('renders slot content over value prop', () => {
    const wrapper = mount(PillTag, {
      props: {
        value: 'Prop Value'
      },
      slots: {
        default: 'Slot Value'
      }
    })
    expect(wrapper.text()).toBe('Slot Value')
  })

  it('applies classes for secondary (default) state', () => {
    const wrapper = mount(PillTag, {
      props: {
        value: 'Secondary'
      }
    })
    expect(wrapper.classes()).toContain('bg-gray-100')
    expect(wrapper.classes()).toContain('text-gray-500')
    expect(wrapper.classes()).toContain('border-gray-200/50')
  })

  it('applies classes for active state', () => {
    const wrapper = mount(PillTag, {
      props: {
        value: 'Active',
        state: 'active'
      }
    })
    expect(wrapper.classes()).toContain('bg-emerald-100')
    expect(wrapper.classes()).toContain('text-emerald-800')
    expect(wrapper.classes()).toContain('border-emerald-200/50')
    expect(wrapper.classes()).toContain('shadow-sm')
  })

  it('applies classes for tertiary state', () => {
    const wrapper = mount(PillTag, {
      props: {
        value: 'Tertiary',
        state: 'tertiary'
      }
    })
    expect(wrapper.classes()).toContain('bg-blue-100')
    expect(wrapper.classes()).toContain('text-blue-800')
    expect(wrapper.classes()).toContain('border-blue-200/50')
  })
})
