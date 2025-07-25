import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import StampEditor from '@/components/editors/StampEditor.vue'
import { StampModelHelper } from '@/models/Stamp'
import { Condition } from '@/models/Condition'
import { createTestingPinia, type TestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import type { CatalogueNumber } from '@/models/CatalogueNumber'
import type { Ownership } from '@/models/Ownership'

type StampEditorType = {
  title: string
  calculateImagePath: () => string
  setRefs: () => void
  state: {
    countryName: string
    prefix: string
  }
  stampModel: {
    countryRef: number
  }
  activeCatalogueNumber: CatalogueNumber
  stampOwnership: Ownership
}

describe('StampEditor', () => {
  describe('title', () => {
    let wrapper: VueWrapper<StampEditorType>
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
        props: {
          model: StampModelHelper.newInstance(true)
        },
        global: {
          plugins: [pinia]
        }
      }) as unknown as VueWrapper<StampEditorType>
      await nextTick()
      const title = wrapper.vm.title
      expect(title).toBe('New Wantlist Stamp')
    })

    it('New Stamp', async () => {
      wrapper = shallowMount(StampEditor, {
        props: {
          model: StampModelHelper.newInstance(false)
        },
        global: {
          plugins: [pinia]
        }
      }) as unknown as VueWrapper<StampEditorType>
      await nextTick()
      const title = wrapper.vm.title
      expect(title).toBe('New Stamp')
    })

    it('Edit Stamp', async () => {
      const m = StampModelHelper.newInstance(false)
      m.id = 100
      wrapper = shallowMount(StampEditor, {
        props: {
          model: m
        },
        global: {
          plugins: [pinia]
        }
      }) as unknown as VueWrapper<StampEditorType>
      await nextTick()
      const title = wrapper.vm.title
      expect(title).toBe('Edit Stamp')
    })

    it('Edit Wantlist Stamp', async () => {
      const m = StampModelHelper.newInstance(true)
      m.id = 23
      wrapper = shallowMount(StampEditor, {
        props: {
          model: m
        },
        global: {
          plugins: [pinia]
        }
      }) as unknown as VueWrapper<StampEditorType>
      await nextTick()
      const title = wrapper.vm.title
      expect(title).toBe('Edit Wantlist Stamp')
    })
  })

  describe('calculateImagePath', () => {
    let wrapper: VueWrapper<StampEditorType>
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
        props: {
          model: StampModelHelper.newInstance(true)
        },
        global: {
          plugins: [pinia]
        }
      }) as unknown as VueWrapper<StampEditorType>
      await nextTick()
      const path = wrapper.vm.calculateImagePath()
      expect(path).toBe('')
    })

    it('full path generation', async () => {
      wrapper = shallowMount(StampEditor, {
        props: {
          model: StampModelHelper.newInstance(false)
        },
        global: {
          plugins: [pinia]
        }
      }) as unknown as VueWrapper<StampEditorType>
      await nextTick()
      wrapper.vm.setRefs()
      wrapper.vm.state = {
        countryName: 'Albania',
        prefix: ''
      }
      wrapper.vm.stampModel.countryRef = 13
      wrapper.vm.activeCatalogueNumber.catalogueRef = 23
      wrapper.vm.activeCatalogueNumber.number = '46a'
      wrapper.vm.activeCatalogueNumber.condition = Condition.USED
      wrapper.vm.calculateImagePath()
      const path = wrapper.vm.stampOwnership.img
      expect(path).toBe('Albania/used/46a.jpg')
    })
  })
})
