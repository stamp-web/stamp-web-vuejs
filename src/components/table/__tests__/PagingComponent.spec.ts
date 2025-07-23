import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import PagingComponent from '@/components/table/PagingComponent.vue'
import type { ComponentPublicInstance } from 'vue'

describe('PagingComponent', () => {
  beforeEach(() => {})

  describe('Initial Component', () => {
    let wrapper

    it('init', () => {
      wrapper = shallowMount(PagingComponent)
      const props = wrapper.vm.$props
      // @ts-ignore
      expect(props.totalPages).toBe(0)
      // @ts-ignore
      expect(props.pageNum).toBe(0)
    })
  })

  describe('Component Actions', () => {
    let wrapper: VueWrapper<any, ComponentPublicInstance<{}, any>>

    beforeEach(() => {
      wrapper = shallowMount(PagingComponent, {
        props: { totalPages: 5, pageNum: 1 }
      })
    })
    it('Initial Values', async () => {
      const props = wrapper.vm.$props
      const refs = wrapper.vm.$refs
      // @ts-ignore
      expect(props.totalPages).toBe(5)
      // @ts-ignore
      expect(props.pageNum).toBe(1)
      // @ts-ignore
      expect(refs['first'].disabled).toBe(true)
      // @ts-ignore
      expect(refs['back'].disabled).toBe(true)
      // @ts-ignore
      expect(refs['next'].disabled).toBe(false)
      // @ts-ignore
      expect(refs['last'].disabled).toBe(false)
    })

    it('Verify Last Page', async () => {
      const refs = wrapper.vm.$refs

      await wrapper.find({ ref: 'last' }).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('last')).toBeTruthy()

      await wrapper.setProps({ pageNum: 5 })
      // @ts-ignore
      expect(refs['first'].disabled).toBe(false)
      // @ts-ignore
      expect(refs['back'].disabled).toBe(false)
      // @ts-ignore
      expect(refs['last'].disabled).toBe(true)
      // @ts-ignore
      expect(refs['next'].disabled).toBe(true)
    })

    it('Verify Forward and Back state', async () => {
      const refs = wrapper.vm.$refs

      await wrapper.find({ ref: 'next' }).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('next')).toBeTruthy()

      await wrapper.setProps({ pageNum: 2 })
      // @ts-ignore
      expect(refs['first'].disabled).toBe(false)
      // @ts-ignore
      expect(refs['back'].disabled).toBe(false)
      // @ts-ignore
      expect(refs['last'].disabled).toBe(false)
      // @ts-ignore
      expect(refs['next'].disabled).toBe(false)

      await wrapper.find({ ref: 'back' }).trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('back')).toBeTruthy()
      await wrapper.setProps({ pageNum: 1 })

      // @ts-ignore
      expect(refs['first'].disabled).toBe(true)
      // @ts-ignore
      expect(refs['back'].disabled).toBe(true)
    })
  })
})
