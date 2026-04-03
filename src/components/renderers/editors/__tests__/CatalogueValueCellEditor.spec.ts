import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CatalogueValueCellEditor from '../CatalogueValueCellEditor.vue'

describe('CatalogueValueCellEditor', () => {
  it('renders TextElement component', () => {
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {
          value: '5.50'
        }
      }
    })

    expect(wrapper.findComponent({ name: 'TextElement' }).exists()).toBe(true)
  })

  it('initializes model with params value', async () => {
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {
          value: '10.75'
        }
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.model).toBe('10.75')
  })

  it('initializes model with 0.0 when value is undefined', async () => {
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {}
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.model).toBe('0.0')
  })

  it('returns parsed float value from getValue()', () => {
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {
          value: '25.50'
        }
      }
    })

    expect(wrapper.vm.getValue()).toBe(25.5)
  })

  it('returns 0.0 when getValue() receives invalid input', () => {
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {
          value: '0.0'
        }
      }
    })

    wrapper.vm.model = 'invalid'
    expect(wrapper.vm.getValue()).toBe(0.0)
  })

  it('calls stopEditing() when Enter key is pressed', async () => {
    const stopEditing = vi.fn()
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {
          value: '5.50',
          stopEditing
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.find('input').trigger('keydown.Enter')
    expect(stopEditing).toHaveBeenCalledWith()
  })

  it('calls stopEditing(true) when Escape key is pressed', async () => {
    const stopEditing = vi.fn()
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {
          value: '5.50',
          stopEditing
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.find('input').trigger('keydown.Escape')

    expect(stopEditing).toHaveBeenCalledWith(true)
  })

  it('does not call stopEditing on other keys', async () => {
    const stopEditing = vi.fn()
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {
          value: '5.50',
          stopEditing
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.find('input').trigger('keydown.a')

    expect(stopEditing).not.toHaveBeenCalled()
  })

  it('exposes getValue method', () => {
    const wrapper = mount(CatalogueValueCellEditor, {
      props: {
        params: {
          value: '15.00'
        }
      }
    })

    expect(typeof wrapper.vm.getValue).toBe('function')
  })
})
