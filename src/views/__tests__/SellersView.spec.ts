/**
 * Attribution: Generated with Gemini AI
 */
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SellersView from '../SellersView.vue'
import { createTestingPinia } from '@pinia/testing'
import { sellerStore } from '@/stores/sellerStore'
import { Prompt } from '@/components/Prompt'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import type { Seller } from '@/models/entityModels'
import SellerEditor from '@/components/editors/SellerEditor.vue'
import FilterInput from '@/components/inputs/FilterInput.vue'

vi.mock('vue-router')
vi.mock('vue-i18n')
vi.mock('@/components/Prompt', () => ({
  Prompt: {
    confirm: vi.fn()
  }
}))

const mockLoadingStarted = vi.fn()
const mockLoadingComplete = vi.fn()

// Stub DataGridComponent with exposed ref methods that are called on mounted()
const DataGridStub = defineComponent({
  name: 'DataGridComponent',
  template: '<div class="data-grid-stub"></div>',
  props: ['columnDefs', 'rowData'],
  setup(props, { expose }) {
    expose({
      loadingStarted: mockLoadingStarted,
      loadingComplete: mockLoadingComplete
    })
    return {}
  }
})

// Helper utility to flush promises
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('SellersView.vue', () => {
  let pushMock: Mock

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    })
    pushMock = vi.fn()
    ;(useRouter as Mock).mockReturnValue({ push: pushMock })
    ;(useI18n as Mock).mockReturnValue({ t: (key: string) => key })
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    const pinia = createTestingPinia()
    const store = sellerStore(pinia)
    ;(store.find as Mock).mockResolvedValue([])

    return mount(SellersView, {
      global: {
        plugins: [pinia],
        stubs: {
          DataGridComponent: DataGridStub,
          TransitionRoot: { template: '<div><slot /></div>', props: ['show'] },
          SellerEditor: true,
          PrimaryButton: { template: '<button type="button"><slot /></button>' },
          SecondaryButton: { template: '<button type="button"><slot /></button>' },
          FilterInput: true
        }
      }
    })
  }

  it('fetches data successfully on mount', async () => {
    createWrapper()
    const store = sellerStore()

    await flushPromises()

    expect(mockLoadingStarted).toHaveBeenCalled()
    expect(store.find).toHaveBeenCalled()
    expect(store.getStampCount).toHaveBeenCalled()
    expect(mockLoadingComplete).toHaveBeenCalled()
  })

  it('opens the editor to create a new seller', async () => {
    const wrapper = createWrapper()
    const button = wrapper.find('#create-seller')

    await button.trigger('click')
    await flushPromises()

    const editor = wrapper.findComponent(SellerEditor)
    expect(editor.exists()).toBe(true)
    expect(editor.props('model')).toBeDefined()
  })

  it('deletes a selected seller after confirmation', async () => {
    const wrapper = createWrapper()
    const store = sellerStore()
    ;(Prompt.confirm as Mock).mockResolvedValue(true)

    const dataGrid = wrapper.findComponent({ ref: 'dataGridRef' })
    const mockSeller = { id: 1, name: 'Test Seller' } as Seller

    // Select an item in the data grid to activate the delete button
    await dataGrid.vm.$emit('selected', mockSeller)

    const deleteBtn = wrapper.find('#delete-seller')
    await deleteBtn.trigger('click')

    await flushPromises()

    expect(Prompt.confirm).toHaveBeenCalledWith({
      message: 'messages.delete-seller'
    })
    expect(store.remove).toHaveBeenCalledWith(mockSeller)
  })

  it('does not delete a seller if confirmation is cancelled', async () => {
    const wrapper = createWrapper()
    const store = sellerStore()
    ;(Prompt.confirm as Mock).mockResolvedValue(false)

    const dataGrid = wrapper.findComponent({ ref: 'dataGridRef' })
    const mockSeller = { id: 1, name: 'Test Seller' } as Seller
    await dataGrid.vm.$emit('selected', mockSeller)

    const deleteBtn = wrapper.find('#delete-seller')
    await deleteBtn.trigger('click')

    await flushPromises()

    expect(Prompt.confirm).toHaveBeenCalled()
    expect(store.remove).not.toHaveBeenCalled()
  })

  it('saves a new seller via the store', async () => {
    const wrapper = createWrapper()
    const store = sellerStore()

    // Ensure editor is visible so it's mounted in the DOM
    await wrapper.find('#create-seller').trigger('click')
    await flushPromises()

    const editor = wrapper.findComponent(SellerEditor)
    const newSeller = { id: 0, name: 'New Seller' } as Seller

    await editor.vm.$emit('save', newSeller)
    await flushPromises()

    expect(store.create).toHaveBeenCalledWith(newSeller)
    expect(store.update).not.toHaveBeenCalled()
  })

  it('updates an existing seller via the store', async () => {
    const wrapper = createWrapper()
    const store = sellerStore()

    // Ensure editor is visible so it's mounted in the DOM
    await wrapper.find('#create-seller').trigger('click')
    await flushPromises()

    const editor = wrapper.findComponent(SellerEditor)
    const existingSeller = { id: 1, name: 'Existing Seller' } as Seller

    await editor.vm.$emit('save', existingSeller)
    await flushPromises()

    expect(store.update).toHaveBeenCalledWith(existingSeller)
    expect(store.create).not.toHaveBeenCalled()
  })

  it('updates the filter string prop correctly when the filter input fires change event', async () => {
    const wrapper = createWrapper()
    const filterInput = wrapper.findComponent(FilterInput)

    await filterInput.vm.$emit('filter-changed', 'test-filter')
    await flushPromises()

    expect(filterInput.props('filterText')).toBe('test-filter')
  })

  it('navigates to stamps view when findStamps is triggered', async () => {
    const wrapper = createWrapper()
    const mockSeller = { id: 123, name: 'Test Seller' } as Seller

    // We access the column definition for the search icon
    // The view defines columnDefs in setup. We can trigger the callback.
    const dataGrid = wrapper.findComponent({ ref: 'dataGridRef' })
    const findStampsCol = (
      dataGrid.props('columnDefs') as Array<{ cellRendererParams: Record<string, unknown> }>
    )[2]

    // Find the callback function inside cellRendererParams (usually named 'action' or 'onClick')
    const params = findStampsCol.cellRendererParams
    const actionFn =
      params['action'] || Object.values(params).find((val) => typeof val === 'function')

    ;(actionFn as (model: Seller) => void)(mockSeller)

    expect(pushMock).toHaveBeenCalledWith({
      path: '/stamps',
      query: { $filter: '(sellerRef eq 123)' }
    })
  })
})
