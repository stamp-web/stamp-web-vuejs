import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import StampEditor from '@/components/editors/StampEditor.vue'
import { StampModelHelper } from '@/models/Stamp'
import { Condition } from '@/models/Condition'
import { createTestingPinia, type TestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
describe('StampEditor', () => {
  describe('title', () => {
    let wrapper: VueWrapper
    let pinia: TestingPinia

    beforeEach(() => {
      pinia = createTestingPinia({
        fakeApp: true,
        createSpy: vi.fn
      })
      setActivePinia(pinia)
    })

    it('New Wantlist Stamp', async () => {
      wrapper = shallowMount(StampEditor, {
        propsData: {
          model: StampModelHelper.newInstance(true)
        },
        global: {
          plugins: [pinia]
        }
      })
      await nextTick()
      // @ts-ignore
      const title = wrapper.vm.title
      expect(title).toBe('New Wantlist Stamp')
    })

    it('New Stamp', async () => {
      wrapper = shallowMount(StampEditor, {
        propsData: {
          model: StampModelHelper.newInstance(false)
        },
        global: {
          plugins: [pinia]
        }
      })
      await nextTick()
      // @ts-ignore
      const title = wrapper.vm.title
      expect(title).toBe('New Stamp')
    })

    it('Edit Stamp', async () => {
      const m = StampModelHelper.newInstance(false)
      m.id = 100
      wrapper = shallowMount(StampEditor, {
        propsData: {
          model: m
        },
        global: {
          plugins: [pinia]
        }
      })
      await nextTick()
      // @ts-ignore
      const title = wrapper.vm.title
      expect(title).toBe('Edit Stamp')
    })

    it('Edit Wantlist Stamp', async () => {
      const m = StampModelHelper.newInstance(true)
      m.id = 23
      wrapper = shallowMount(StampEditor, {
        propsData: {
          model: m
        },
        global: {
          plugins: [pinia]
        }
      })
      await nextTick()
      // @ts-ignore
      const title = wrapper.vm.title
      expect(title).toBe('Edit Wantlist Stamp')
    })
  })

  describe('calculateImagePath', () => {
    let wrapper: VueWrapper
    let pinia: TestingPinia

    beforeEach(() => {
      pinia = createTestingPinia({
        fakeApp: true,
        createSpy: vi.fn
      })
      setActivePinia(pinia)
    })

    it('stamp is a wantlist', async () => {
      wrapper = shallowMount(StampEditor, {
        propsData: {
          model: StampModelHelper.newInstance(true)
        },
        global: {
          plugins: [pinia]
        }
      })
      await nextTick()
      // @ts-ignore
      const path = wrapper.vm.calculateImagePath()
      expect(path).toBe('')
    })

    it('full path generation', async () => {
      wrapper = shallowMount(StampEditor, {
        propsData: {
          model: StampModelHelper.newInstance(false)
        },
        global: {
          plugins: [pinia]
        }
      })
      await nextTick()
      // @ts-ignore
      wrapper.vm.setRefs()
      // @ts-ignore
      wrapper.vm.state = {
        countryName: 'Albania',
        prefix: ''
      }
      // @ts-ignore
      wrapper.vm.stampModel.countryRef = 13
      // @ts-ignore
      wrapper.vm.activeCatalogueNumber.catalogueRef = 23
      // @ts-ignore
      wrapper.vm.activeCatalogueNumber.number = '46a'
      // @ts-ignore
      wrapper.vm.activeCatalogueNumber.condition = Condition.USED
      // @ts-ignore
      wrapper.vm.calculateImagePath()
      // @ts-ignore
      const path = wrapper.vm.stampOwnership.img
      expect(path).toBe('Albania/used/46a.jpg')
    })
  })
})
