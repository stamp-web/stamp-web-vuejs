import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import PagingComponent from '@/components/table/PagingComponent.vue'

describe('PagingComponent', () => {
  beforeEach(() => {})

  describe('Initial Component', () => {
    let wrapper: VueWrapper<InstanceType<typeof PagingComponent>>

    it('init', () => {
      wrapper = shallowMount(PagingComponent)
      const props = wrapper.props()
      expect(props.totalPages).toBe(0)
      expect(props.pageNum).toBe(0)
    })
  })

  describe('Component Actions', () => {
    let wrapper: VueWrapper<InstanceType<typeof PagingComponent>>

    beforeEach(() => {
      wrapper = shallowMount(PagingComponent, {
        props: { totalPages: 5, pageNum: 1 }
      })
    })
    it('Initial Values', async () => {
      const props = wrapper.props()
      const refs = wrapper.vm.$refs as {
        first: HTMLButtonElement
        back: HTMLButtonElement
        next: HTMLButtonElement
        last: HTMLButtonElement
      }
      expect(props.totalPages).toBe(5)
      expect(props.pageNum).toBe(1)
      expect(refs.first.disabled).toBe(true)
      expect(refs.back.disabled).toBe(true)
      expect(refs.next.disabled).toBe(false)
      expect(refs.last.disabled).toBe(false)
    })

    it('Verify Last Page', async () => {
      const refs = wrapper.vm.$refs as {
        first: HTMLButtonElement
        back: HTMLButtonElement
        next: HTMLButtonElement
        last: HTMLButtonElement
      }

      await wrapper.find({ ref: 'last' }).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('last')).toBeTruthy()

      await wrapper.setProps({ pageNum: 5 })
      expect(refs.first.disabled).toBe(false)
      expect(refs.back.disabled).toBe(false)
      expect(refs.last.disabled).toBe(true)
      expect(refs.next.disabled).toBe(true)
    })

    it('Verify Forward and Back state', async () => {
      const refs = wrapper.vm.$refs as {
        first: HTMLButtonElement
        back: HTMLButtonElement
        next: HTMLButtonElement
        last: HTMLButtonElement
      }

      await wrapper.find({ ref: 'next' }).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('next')).toBeTruthy()

      await wrapper.setProps({ pageNum: 2 })
      expect(refs.first.disabled).toBe(false)
      expect(refs.back.disabled).toBe(false)
      expect(refs.last.disabled).toBe(false)
      expect(refs.next.disabled).toBe(false)

      await wrapper.find({ ref: 'back' }).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('back')).toBeTruthy()
      await wrapper.setProps({ pageNum: 1 })

      expect(refs.first.disabled).toBe(true)
      expect(refs.back.disabled).toBe(true)
    })
  })
})
