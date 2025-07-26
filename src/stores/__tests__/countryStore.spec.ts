import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { countryStore } from '@/stores/countryStore'
import countryService from '@/services/CountryService'
import type { Country } from '@/models/entityModels'
import type { CountModel } from '@/models/countModel'
import { EntityList } from '@/models/entityList'

vi.mock('@/services/CountryService', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getStampCount: vi.fn()
  }
}))

describe('countryStore', () => {
  let store: ReturnType<typeof countryStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = countryStore()

    vi.mocked(countryService.find).mockReset()
    vi.mocked(countryService.create).mockReset()
    vi.mocked(countryService.update).mockReset()
    vi.mocked(countryService.remove).mockReset()

    // we cache $filter so we need to force clear it
    await store.find({
      $filter: "(name eq 'Clear it')"
    })
  })

  it('should find countries with default sort', async () => {
    const mockCountries: Country[] = [
      { id: 1, name: 'USA', description: 'United States' },
      { id: 2, name: 'Canada', description: 'Canada' }
    ]
    const mockResponse = new EntityList<Country>()
    mockResponse.items = mockCountries
    mockResponse.total = mockCountries.length

    vi.mocked(countryService.find).mockResolvedValue(mockResponse)

    const result = await store.find()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Canada')
    expect(countryService.find).toHaveBeenCalled()
  })

  it('should find countries with ascending name sort', async () => {
    const mockCountries: Country[] = [
      { id: 1, name: 'USA', description: 'United States' },
      { id: 2, name: 'Canada', description: 'Canada' }
    ]
    const mockResponse = new EntityList<Country>()
    mockResponse.items = mockCountries
    mockResponse.total = mockCountries.length

    vi.mocked(countryService.find).mockResolvedValue(mockResponse)

    const result = await store.find({ $orderby: 'name asc' })

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Canada')
    expect(countryService.find).toHaveBeenCalled()
  })

  it('should create a country', async () => {
    const newCountry: Country = { id: 3, name: 'Mexico', description: 'Mexico' }
    const createdCountry: Country = { ...newCountry }

    vi.mocked(countryService.create).mockResolvedValue(createdCountry)

    const result = await store.create(newCountry)

    expect(result).toEqual(createdCountry)
    expect(countryService.create).toHaveBeenCalledWith(newCountry)
  })

  it('should update a country', async () => {
    const country: Country = { id: 1, name: 'USA', description: 'Updated description' }

    vi.mocked(countryService.update).mockResolvedValue(country)

    const result = await store.update(country)

    expect(result).toEqual(country)
    expect(countryService.update).toHaveBeenCalledWith(country)
  })

  it('should remove a country', async () => {
    const country: Country = { id: 1, name: 'USA', description: 'United States' }

    vi.mocked(countryService.remove).mockResolvedValue()

    await store.remove(country)

    expect(countryService.remove).toHaveBeenCalledWith(country)
  })

  it('should get stamp counts', async () => {
    const mockCounts: CountModel[] = [
      { id: 1, count: 10 },
      { id: 2, count: 5 }
    ]

    vi.mocked(countryService.getStampCount).mockResolvedValue(mockCounts)

    const result = await store.getStampCount()

    expect(result).toEqual(mockCounts)
    expect(countryService.getStampCount).toHaveBeenCalled()
  })

  it('should find country by id', async () => {
    const mockCountries: Country[] = [
      { id: 1, name: 'USA', description: 'United States' },
      { id: 2, name: 'Canada', description: 'Canada' }
    ]
    const mockResponse = new EntityList<Country>()
    mockResponse.items = mockCountries
    mockResponse.total = mockCountries.length

    vi.mocked(countryService.find).mockResolvedValue(mockResponse)

    await store.find() // Populate the store
    const result = await store.findById(1)

    expect(result).toBeDefined()
    expect(result.name).toBe('USA')
  })

  it('should find a random country', async () => {
    const mockCountries: Country[] = [{ id: 1, name: 'USA', description: 'United States' }]
    const mockResponse = new EntityList<Country>()
    mockResponse.items = mockCountries
    mockResponse.total = mockCountries.length

    vi.mocked(countryService.find).mockResolvedValue(mockResponse)

    const result = await store.findRandom()

    expect(result).toBeDefined()
    expect(countryService.find).toHaveBeenCalled()
  })

  it('should get count', async () => {
    const mockCountries: Country[] = [
      { id: 1, name: 'USA', description: 'United States' },
      { id: 2, name: 'Canada', description: 'Canada' }
    ]
    const mockResponse = new EntityList<Country>()
    mockResponse.items = mockCountries
    mockResponse.total = mockCountries.length

    vi.mocked(countryService.find).mockResolvedValue(mockResponse)

    await store.find() // Populate the store
    const count = store.getCount()

    expect(count).toBe(2)
  })
})
