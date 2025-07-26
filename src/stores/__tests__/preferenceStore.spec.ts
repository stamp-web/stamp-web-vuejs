import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { preferenceStore } from '@/stores/preferenceStore'
import PreferenceService from '@/services/PreferenceService'
import type { Preference } from '@/models/Preference'

// Mock the PreferenceService
vi.mock('@/services/PreferenceService', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

describe('preferenceStore', () => {
  let store: ReturnType<typeof preferenceStore>

  const mockPreference: Preference = {
    id: 1,
    name: 'testPref',
    category: 'testCategory',
    value: 'testValue'
  }

  const mockPreferences: Preference[] = [
    mockPreference,
    {
      id: 2,
      name: 'testPref2',
      category: 'testCategory',
      value: 'testValue2'
    },
    {
      id: 3,
      name: 'otherPref',
      category: 'otherCategory',
      value: 'otherValue'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = preferenceStore()

    // Reset mock implementations
    vi.mocked(PreferenceService.find).mockReset()
    vi.mocked(PreferenceService.create).mockReset()
    vi.mocked(PreferenceService.update).mockReset()
    vi.mocked(PreferenceService.remove).mockReset()
  })

  describe('find', () => {
    it('should fetch preferences with given options', async () => {
      vi.mocked(PreferenceService.find).mockResolvedValue({
        items: mockPreferences,
        total: mockPreferences.length
      })

      const options = { $orderby: 'name asc' }
      const result = await store.find(options)

      expect(PreferenceService.find).toHaveBeenCalledWith(options)
      expect(result).toEqual(mockPreferences)
      expect(store.items.total).toBe(mockPreferences.length)
    })
  })

  describe('findByCategory', () => {
    it('should filter existing items if already loaded without filter', async () => {
      store.items.list = structuredClone(mockPreferences)
      store.lastOptions = {}

      const result = await store.findByCategory('testCategory')

      expect(PreferenceService.find).not.toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result.every((p) => p.category === 'testCategory')).toBe(true)
    })

    it('should fetch from service if items not loaded or filtered', async () => {
      const filteredPreferences = mockPreferences.filter((p) => p.category === 'testCategory')
      vi.mocked(PreferenceService.find).mockResolvedValue({
        items: filteredPreferences,
        total: filteredPreferences.length
      })
      store.lastOptions = { $filter: 'someFilter' }
      const result = await store.findByCategory('testCategory')

      expect(PreferenceService.find).toHaveBeenCalledWith({
        $filter: "(category eq 'testCategory')"
      })

      expect(result).toHaveLength(2)
    })
  })

  describe('findByNameAndCategory', () => {
    it('should find preference by name and category from loaded items', async () => {
      store.items.list = [mockPreference]
      store.lastOptions = {}

      const result = await store.findByNameAndCategory('testPref', 'testCategory')

      expect(PreferenceService.find).not.toHaveBeenCalled()
      expect(result).toEqual(mockPreference)
    })

    it('should load items first if not loaded', async () => {
      vi.mocked(PreferenceService.find).mockResolvedValue({
        items: [mockPreference],
        total: mockPreferences.length
      })

      const result = await store.findByNameAndCategory('testPref', 'testCategory')

      expect(PreferenceService.find).toHaveBeenCalled()
      expect(result).toEqual(mockPreference)
    })
  })

  describe('CRUD operations', () => {
    beforeEach(() => {
      // Initialize the store with mock data before each CRUD test
      store.items.list = [...mockPreferences]
      store.items.total = mockPreferences.length
    })

    it('should create a preference', async () => {
      const newPreference = { ...mockPreference, id: 4 }
      vi.mocked(PreferenceService.create).mockResolvedValue(newPreference)

      const result = await store.create(newPreference)

      expect(PreferenceService.create).toHaveBeenCalledWith(newPreference)
      expect(result).toEqual(newPreference)
      const pref = store.items.list.find((p: Preference) => {
        return p.id === 4
      }) as Preference
      expect(pref).toBeDefined()
    })

    it('should update a preference', async () => {
      const updatedPreference = { ...mockPreference, value: 'updatedValue' }
      vi.mocked(PreferenceService.update).mockResolvedValue(updatedPreference)

      const result = await store.update(updatedPreference)

      expect(PreferenceService.update).toHaveBeenCalledWith(updatedPreference)
      expect(result).toEqual(updatedPreference)
    })

    it('should remove a preference', async () => {
      store.items.list = [...mockPreferences]
      store.items.total = mockPreferences.length
      await store.remove(mockPreference)

      expect(PreferenceService.remove).toHaveBeenCalledWith(mockPreference)
      const pref = store.items.list.find((p: Preference) => {
        return p.id === mockPreference.id
      }) as Preference
      expect(pref).toBeUndefined()
      expect(store.items.total).toBe(mockPreferences.length - 1)
    })
  })
})
