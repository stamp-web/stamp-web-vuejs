import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { mount, VueWrapper } from '@vue/test-utils'
import SettingsView from '@/views/SettingsView.vue'
import { preferenceStore } from '@/stores/preferenceStore'
import type { Preference } from '@/models/Preference'

interface SettingsViewComponent {
  model: {
    countryRef: number
    stampCollectionRef: number
    code: string
  }
  savePreferences: () => Promise<void>
  preprocessPreferences: (list: Array<Preference>) => void
}

describe('SettingsView', () => {
  let store: ReturnType<typeof preferenceStore>
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
    const component = wrapper.vm as unknown as SettingsViewComponent
    component.model.countryRef = 115

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
    spyUpdate.mockReturnValue(Promise.resolve({} as Preference))
    spyfindByNameAndCategory.mockImplementation(findByNameAndCategory)

    await component.savePreferences()
    expect(spyfindByNameAndCategory).toHaveBeenCalled()
  })
  it('preprocessPreferences', () => {
    const list: Array<Preference> = new Array<Preference>()
    list.push({ name: 'stampCollectionRef', category: 'stamps', value: '100' } as Preference)
    list.push({ name: 'countryRef', category: 'stamps', value: '101' } as Preference)
    list.push({ name: 'code', category: 'stamps', value: 'USD' } as Preference)

    const component = wrapper.vm as unknown as SettingsViewComponent
    component.preprocessPreferences(list)
    expect(component.model.countryRef).toBe(101)
    expect(component.model.stampCollectionRef).toBe(100)
    expect(component.model.code).toBe('USD')
  })
})
