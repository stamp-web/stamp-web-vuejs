import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { mount, VueWrapper } from '@vue/test-utils'
import SettingsView from '@/views/SettingsView.vue'
import { preferenceStore } from '@/stores/PreferenceStore'
import type { Preference } from '@/models/Preference'

describe('SettingsView', () => {
  let store: any = null
  let wrapper: VueWrapper

  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
    store = preferenceStore()
    const spyFind = vi.spyOn(store, 'find')
    spyFind.mockImplementation(() => Promise.resolve([]))

    vi.mock('vue-router', () => ({
      useRouter: () => ({
        push: vi.fn()
      })
    }))

    wrapper = mount(SettingsView, {
      global: {
        plugins: [pinia]
      }
    })
  })

  it('savePreferences', async () => {
    // @ts-ignore
    const model = wrapper.vm.model
    model.countryRef = 115

    //
    const findByNameAndCategory = vi.fn().mockImplementation((name, category) => {
      if (category === 'stamps' && name === 'countryRef') {
        return Promise.resolve({
          name: 'countryRef',
          category: 'stamps',
          value: '100'
        } as Preference)
      } else {
        return Promise.resolve()
      }
    })
    const spyfindByNameAndCategory = vi.spyOn(store, 'findByNameAndCategory')
    const spyUpdate = vi.spyOn(store, 'update')
    spyUpdate.mockReturnValue(() => {
      return Promise.resolve({} as Preference)
    })
    spyfindByNameAndCategory.mockImplementation(findByNameAndCategory)
    // @ts-ignore
    await wrapper.vm.savePreferences()
    expect(spyfindByNameAndCategory).toHaveBeenCalled()
  })
  it('preprocessPreferences', () => {
    const list: Array<Preference> = new Array<Preference>()
    list.push({ name: 'stampCollectionRef', category: 'stamps', value: '100' } as Preference)
    list.push({ name: 'countryRef', category: 'stamps', value: '101' } as Preference)
    list.push({ name: 'code', category: 'stamps', value: 'USD' } as Preference)

    // @ts-ignore
    wrapper.vm.preprocessPreferences(list)
    // @ts-ignore
    const model = wrapper.vm.model
    expect(model.countryRef).toBe(101)
    expect(model.stampCollectionRef).toBe(100)
    expect(model.code).toBe('USD')
  })
})
