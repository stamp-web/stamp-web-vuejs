import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import StampsView from '../StampsView.vue'
import { createTestingPinia, type TestingPinia } from '@pinia/testing'
import { stampStore } from '@/stores/stampStore'
import { countryStore } from '@/stores/countryStore'
import { catalogueStore } from '@/stores/catalogueStore'
import { preferenceStore } from '@/stores/preferenceStore'
import { defineComponent, nextTick } from 'vue'
import type { Stamp } from '@/models/Stamp'

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  }),
  useRoute: () => ({
    query: {}
  })
}))
vi.mock('@/services/ReportService', () => ({
  default: {
    executeReport: () => Promise.resolve({ value: 100, code: 'USD' }),
    buildReport: () => ({})
  }
}))
const mockLoadingStarted = vi.fn()
const mockLoadingComplete = vi.fn()

const DataGridStub = defineComponent({
  name: 'DataGridComponent',
  template: '<div class="data-grid-stub"></div>',
  props: ['columnDefs', 'rowData', 'selectedData'],
  setup(props, { expose }) {
    expose({
      loadingStarted: mockLoadingStarted,
      loadingComplete: mockLoadingComplete
    })
    return {}
  }
})

type StampsViewType = {
  isReferencesShown: boolean
  toggleReferences: () => void
  selectedStamp: Stamp | undefined
  isEditorShown: () => boolean
  setEditModel: (model: Stamp) => Promise<void>
}

describe('StampsView.vue', () => {
  let pinia: TestingPinia

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    })

    vi.clearAllMocks()
  })

  const createWrapper = () => {
    pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    const store = stampStore(pinia)
    ;(store.find as Mock).mockResolvedValue([])
    ;(store.getCount as Mock).mockReturnValue(0)

    const countries = countryStore(pinia)
    ;(countries.findRandom as Mock).mockResolvedValue({ id: 1, name: 'Canada' })

    const catalogues = catalogueStore(pinia)
    ;(catalogues.find as Mock).mockResolvedValue([])

    const preferences = preferenceStore(pinia)
    ;(preferences.findByNameAndCategory as Mock).mockResolvedValue({ value: '/' })

    return mount(StampsView, {
      global: {
        plugins: [pinia],
        stubs: {
          DataGridComponent: DataGridStub,
          TransitionRoot: { template: '<div><slot /></div>', props: ['show'] },
          StampEditor: true,
          ReferenceCatalogueNumbers: true,
          PrimaryButton: true,
          SecondaryButton: true,
          FilterInput: true,
          WantListFilterInput: true,
          ConditionFilterInput: true,
          PagingSizeInput: true,
          PagingComponent: true,
          StampReportValues: true,
          DisplayStats: true,
          Popover: true,
          PopoverButton: true,
          PopoverPanel: true
        }
      }
    }) as unknown as VueWrapper<StampsViewType>
  }

  it('references button is initially disabled', async () => {
    const wrapper = createWrapper()
    await nextTick()
    
    const refBtn = wrapper.find('#btn-references')
    expect(refBtn.attributes('disabled')).toBeDefined()
  })

  it('references button is only visible on large viewports (width > 1280px)', async () => {
    const wrapper = createWrapper()
    await nextTick()
    
    const refBtn = wrapper.find('#btn-references')
    expect(refBtn.classes()).toContain('hidden')
    expect(refBtn.classes()).toContain('xl:flex')
  })

  it('references button is enabled when exactly one stamp is selected', async () => {
    const wrapper = createWrapper()
    const mockStamp = { id: 1, rate: '5c', countryRef: 1, catalogueNumbers: [] } as unknown as Stamp
    
    const dataGrid = wrapper.findComponent(DataGridStub)
    await dataGrid.vm.$emit('selected', mockStamp)
    await nextTick()

    const refBtn = wrapper.find('#btn-references')
    expect(refBtn.attributes('disabled')).not.toBe('true')
  })

  it('toggles isReferencesShown when references button is clicked', async () => {
    const wrapper = createWrapper()
    const mockStamp = { id: 1, rate: '5c', countryRef: 1, catalogueNumbers: [] } as unknown as Stamp
    
    const dataGrid = wrapper.findComponent(DataGridStub)
    await dataGrid.vm.$emit('selected', mockStamp)
    await nextTick()

    expect(wrapper.vm.isReferencesShown).toBe(false)
    
    const refBtn = wrapper.find('#btn-references')
    await refBtn.trigger('click')
    await nextTick()

    expect(wrapper.vm.isReferencesShown).toBe(true)
  })

  it('closes references panel if the editor is shown', async () => {
    const wrapper = createWrapper()
    const mockStamp = { id: 1, rate: '5c', countryRef: 1, catalogueNumbers: [] } as unknown as Stamp
    
    const dataGrid = wrapper.findComponent(DataGridStub)
    await dataGrid.vm.$emit('selected', mockStamp)
    await nextTick()

    wrapper.vm.toggleReferences()
    expect(wrapper.vm.isReferencesShown).toBe(true)

    // Simulate editor becoming shown reactively
    await wrapper.vm.setEditModel(mockStamp)
    await nextTick()
    expect(wrapper.vm.isReferencesShown).toBe(false)
  })
})
