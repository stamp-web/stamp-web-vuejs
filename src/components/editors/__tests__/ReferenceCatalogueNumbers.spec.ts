import {beforeEach, describe, expect, it, vi} from 'vitest'
import {nextTick} from 'vue'
import {mount, shallowMount, VueWrapper} from '@vue/test-utils'
import ReferenceCatalogueNumbers from '@/components/editors/ReferenceCatalogueNumbers.vue'
import {createTestingPinia, type TestingPinia} from '@pinia/testing'
import {setActivePinia} from 'pinia'
import type {Stamp} from '@/models/Stamp'
import type {CatalogueNumber} from '@/models/CatalogueNumber'
import CatalogueNumberService from '@/services/CatalogueNumberService'
import {Prompt} from '@/components/Prompt'
import {catalogueStore} from '@/stores/catalogueStore'
import type {Catalogue} from '@/models/Catalogue'
import {stampStore} from '@/stores/stampStore'

vi.mock('@/services/CatalogueNumberService', () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    makeActive: vi.fn()
  }
}))

vi.mock('@/components/Prompt', () => ({
  Prompt: {
    confirm: vi.fn(() => Promise.resolve(true)),
    alert: vi.fn(() => Promise.resolve())
  }
}))

type RefCatNumType = {
  editingCn: CatalogueNumber | null
  sortedCatalogueNumbers: CatalogueNumber[]
  startAdd: () => void
  startEdit: (cn: CatalogueNumber) => void
  makeActive: (id: number) => Promise<void>
  deleteCn: (cn: CatalogueNumber) => Promise<void>
  saveCn: () => Promise<void>
}

describe('ReferenceCatalogueNumbers', () => {
  let pinia: TestingPinia
  let mockStamp: Stamp

  beforeEach(() => {
    pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)

    const catStore = catalogueStore(pinia)
    vi.mocked(catStore.find).mockResolvedValue([
      { id: 2, name: 'Scott standard', code: 'USD' },
      { id: 3, name: 'Stanley Gibbons', code: 'GBP' }
    ] as Catalogue[])

    const sStore = stampStore(pinia)
    vi.mocked(sStore.update).mockImplementation((stamp) => Promise.resolve(stamp))

    mockStamp = {
      id: 10,
      rate: '5c',
      countryRef: 1,
      wantList: false,
      catalogueNumbers: [
        {
          id: 1,
          catalogueRef: 2,
          number: '12',
          value: 1.5,
          active: true,
          condition: 1
        } as CatalogueNumber,
        {
          id: 2,
          catalogueRef: 3,
          number: '15a',
          value: 12.0,
          active: false,
          condition: 2
        } as CatalogueNumber
      ],
      activeCatalogueNumber: {
        id: 1,
        catalogueRef: 2,
        number: '12',
        value: 1.5,
        active: true,
        condition: 1
      } as CatalogueNumber
    } as Stamp

    vi.clearAllMocks()
  })

  it('renders and computes sorted catalogue numbers (active first)', async () => {
    const wrapper = shallowMount(ReferenceCatalogueNumbers, {
      props: { stamp: mockStamp },
      global: { plugins: [pinia] }
    }) as unknown as VueWrapper<RefCatNumType>

    await nextTick()
    expect(wrapper.vm.sortedCatalogueNumbers.length).toBe(2)
    expect(wrapper.vm.sortedCatalogueNumbers[0].active).toBe(true)
  })

  it('toggles to edit mode on startAdd', async () => {
    // spy on console to ensure VueForm does not have any errors or warnings
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount(ReferenceCatalogueNumbers, {
      props: { stamp: mockStamp },
      global: { plugins: [pinia] }
    }) as unknown as VueWrapper<RefCatNumType>

    await nextTick()
    expect(wrapper.vm.editingCn).toBeNull()

    wrapper.vm.startAdd()
    await nextTick()
    await nextTick() // Wait another tick for form to compile/validate

    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()

    expect(wrapper.vm.editingCn).not.toBeNull()
    expect(wrapper.vm.editingCn?.id).toBe(0)
    expect(wrapper.vm.editingCn?.active).toBe(false)

    warnSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('toggles to edit mode on startEdit', async () => {
    const wrapper = shallowMount(ReferenceCatalogueNumbers, {
      props: { stamp: mockStamp },
      global: { plugins: [pinia] }
    }) as unknown as VueWrapper<RefCatNumType>

    await nextTick()
    wrapper.vm.startEdit(mockStamp.catalogueNumbers[1])
    await nextTick()
    expect(wrapper.vm.editingCn).not.toBeNull()
    expect(wrapper.vm.editingCn?.id).toBe(2)
  })

  it('calls makeActive service and emits stamp-updated', async () => {
    const updatedStamp = { ...mockStamp, id: 10 }
    vi.mocked(CatalogueNumberService.makeActive).mockResolvedValue(updatedStamp)

    const wrapper = shallowMount(ReferenceCatalogueNumbers, {
      props: { stamp: mockStamp },
      global: { plugins: [pinia] }
    }) as unknown as VueWrapper<RefCatNumType>

    await nextTick()
    await wrapper.vm.makeActive(2)
    expect(CatalogueNumberService.makeActive).toHaveBeenCalledWith(2)
    expect(wrapper.emitted('stamp-updated')).toBeTruthy()

    const emittedStamp = wrapper.emitted('stamp-updated')?.[0][0] as Stamp
    expect(emittedStamp.activeCatalogueNumber?.id).toBe(2)
    expect(emittedStamp.activeCatalogueNumber?.active).toBe(true)
    expect(emittedStamp.catalogueNumbers.find((cn) => cn.id === 2)?.active).toBe(true)
    expect(emittedStamp.catalogueNumbers.find((cn) => cn.id === 1)?.active).toBe(false)
  })

  it('calls delete service on confirmation and updates stamp', async () => {
    vi.mocked(Prompt.confirm).mockResolvedValue(true)
    const sStore = stampStore(pinia)

    const wrapper = shallowMount(ReferenceCatalogueNumbers, {
      props: { stamp: mockStamp },
      global: { plugins: [pinia] }
    }) as unknown as VueWrapper<RefCatNumType>

    await nextTick()
    const targetCn = mockStamp.catalogueNumbers[1]
    await wrapper.vm.deleteCn(targetCn)
    expect(Prompt.confirm).toHaveBeenCalled()
    expect(sStore.update).toHaveBeenCalled()
    expect(wrapper.emitted('stamp-updated')).toBeTruthy()
    const emittedStamp = wrapper.emitted('stamp-updated')?.[0][0] as Stamp
    expect(emittedStamp.catalogueNumbers.find((cn) => cn.id === targetCn.id)).toBeUndefined()
  })
})
