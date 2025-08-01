import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import StampCollectionCellRenderer from '../StampCollectionCellRenderer.vue'
import { stampCollectionStore } from '@/stores/stampCollectionStore'
import type { StampCollection } from '@/models/entityModels'

type StampCollectionCellRendererType = InstanceType<typeof StampCollectionCellRenderer> & {
  collections: StampCollection[]
  findCollectionName: (id: number) => string
  collectionName: string | undefined
}

describe('StampCollectionCellRenderer', () => {
  let store = null
  const collectionResult = [
    {
      id: 1,
      name: 'collection-1'
    },
    { id: 2, name: 'collection-2' }
  ]
  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
    store = stampCollectionStore()
    const spyGetList = vi.spyOn(store, 'find')
    spyGetList.mockImplementation(() => Promise.resolve(collectionResult))
  })

  describe('findCollectionName tests', () => {
    it('test matching id', () => {
      const wrapper = shallowMount(
        StampCollectionCellRenderer
      ) as VueWrapper<StampCollectionCellRendererType>
      wrapper.vm.collections = collectionResult
      expect(wrapper.vm.findCollectionName(2)).toBe('collection-2')
    })

    it('no matching id', () => {
      const wrapper = shallowMount(
        StampCollectionCellRenderer
      ) as VueWrapper<StampCollectionCellRendererType>
      wrapper.vm.collections = collectionResult
      expect(wrapper.vm.findCollectionName(42)).toBe('')
    })
  })

  /**
   * While this essentially tests the same underlying findCollectionName code this will test
   * the parameter handling for the cell renderer value
   */
  describe('collectionName computed property test', () => {
    it('test matching id', () => {
      const comp = shallowMount(StampCollectionCellRenderer, {
        propsData: {
          params: {
            value: 2
          }
        }
      }) as VueWrapper<StampCollectionCellRendererType>
      comp.vm.collections = collectionResult
      expect(comp.vm.collectionName).toBe('collection-2')
    })
  })
})
