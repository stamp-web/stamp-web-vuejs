import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UpdatedCellRenderer from '../UpdatedCellRenderer.vue'

describe('UpdatedCellRenderer', () => {
  it('renders with sw-icon-ok class when updated is true', () => {
    const wrapper = mount(UpdatedCellRenderer, {
      props: {
        params: {
          data: {
            updated: true
          }
        }
      }
    })

    const span = wrapper.find('span')
    expect(span.classes()).toContain('sw-icon-ok')
  })

  it('renders with sw-icon-time class when updated is false', () => {
    const wrapper = mount(UpdatedCellRenderer, {
      props: {
        params: {
          data: {
            updated: false
          }
        }
      }
    })

    const span = wrapper.find('span')
    expect(span.classes()).toContain('sw-icon-time')
  })

  it('renders with sw-icon-time class when updated is undefined', () => {
    const wrapper = mount(UpdatedCellRenderer, {
      props: {
        params: {
          data: {}
        }
      }
    })

    const span = wrapper.find('span')
    expect(span.classes()).toContain('sw-icon-time')
  })

  it('renders with base icon-cell and tailwind classes', () => {
    const wrapper = mount(UpdatedCellRenderer, {
      props: {
        params: {
          data: {
            updated: true
          }
        }
      }
    })

    const span = wrapper.find('span')
    expect(span.classes()).toContain('icon-cell')
    expect(span.classes()).toContain('flex')
    expect(span.classes()).toContain('items-center')
    expect(span.classes()).toContain('h-4')
    expect(span.classes()).toContain('w-4')
  })

  it('renders without params prop', () => {
    const wrapper = mount(UpdatedCellRenderer, {
      props: {}
    })

    const span = wrapper.find('span')
    expect(span.exists()).toBe(true)
    expect(span.classes()).toContain('sw-icon-time')
  })
})
