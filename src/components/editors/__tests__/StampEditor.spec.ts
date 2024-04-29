import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import StampEditor from '@/components/editors/StampEditor.vue'
import { StampModelHelper } from '@/models/Stamp'
import { Condition } from '@/models/Condition'
import { createTestingPinia, type TestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
describe('StampEditor', () => {
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
