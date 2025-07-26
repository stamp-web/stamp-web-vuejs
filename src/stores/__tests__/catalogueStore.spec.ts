import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { catalogueStore } from '@/stores/catalogueStore'
import catalogueService from '@/services/CatalogueService'
import { type Catalogue, CatalogueType } from '@/models/Catalogue'
import type { CountModel } from '@/models/countModel'
import { EntityList } from '@/models/entityList'
import { CurrencyCode } from '@/models/CurrencyCode'

vi.mock('@/services/CatalogueService', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getStampCount: vi.fn()
  }
}))

describe('catalogueStore', () => {
  let store: ReturnType<typeof catalogueStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = catalogueStore()

    vi.mocked(catalogueService.find).mockReset()
    vi.mocked(catalogueService.create).mockReset()
    vi.mocked(catalogueService.update).mockReset()
    vi.mocked(catalogueService.remove).mockReset()

    // we cache $filter so we need to force clear it
    await store.find({
      $filter: "(name eq 'Clear it')"
    })
  })

  it('should find catalogues with default sort', async () => {
    const mockCatalogues: Catalogue[] = [
      {
        id: 1,
        name: 'Stanley Gibbons',
        description: 'British Commonwealth',
        issue: 2023,
        type: CatalogueType.STANLEY_GIBBONS,
        code: CurrencyCode.GBP
      },
      {
        id: 2,
        name: 'Scott',
        description: 'Scott',
        issue: 2022,
        type: CatalogueType.SCOTT,
        code: CurrencyCode.USD
      }
    ]
    const mockResponse = new EntityList<Catalogue>()
    mockResponse.items = mockCatalogues
    mockResponse.total = mockCatalogues.length

    vi.mocked(catalogueService.find).mockResolvedValue(mockResponse)

    const result = await store.find()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Scott')
    expect(catalogueService.find).toHaveBeenCalled()
  })

  it('should find catalogues with ascending name sort', async () => {
    const mockCatalogues: Catalogue[] = [
      {
        id: 1,
        name: 'Stanley Gibbons',
        description: 'British Commonwealth',
        issue: 2023,
        type: CatalogueType.STANLEY_GIBBONS,
        code: CurrencyCode.GBP
      },
      {
        id: 2,
        name: 'Scott',
        description: 'Scott',
        issue: 2022,
        type: CatalogueType.SCOTT,
        code: CurrencyCode.USD
      }
    ]
    const mockResponse = new EntityList<Catalogue>()
    mockResponse.items = mockCatalogues
    mockResponse.total = mockCatalogues.length

    vi.mocked(catalogueService.find).mockResolvedValue(mockResponse)

    const result = await store.find({ $orderby: 'name asc' })

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Scott')
    expect(catalogueService.find).toHaveBeenCalled()
  })

  it('should create a catalogue', async () => {
    const newCatalogue: Catalogue = {
      id: 3,
      name: 'Michel',
      description: 'Michel',
      issue: 2015,
      type: CatalogueType.MICHEL,
      code: CurrencyCode.EUR
    }
    const createdCatalogue: Catalogue = { ...newCatalogue }

    vi.mocked(catalogueService.create).mockResolvedValue(createdCatalogue)

    const result = await store.create(newCatalogue)

    expect(result).toEqual(createdCatalogue)
    expect(catalogueService.create).toHaveBeenCalledWith(newCatalogue)
  })

  it('should update a catalogue', async () => {
    const catalogue: Catalogue = {
      id: 1,
      name: 'Stanley Gibbons',
      description: 'Updated description',
      issue: 2023,
      type: CatalogueType.STANLEY_GIBBONS,
      code: CurrencyCode.GBP
    }

    vi.mocked(catalogueService.update).mockResolvedValue(catalogue)

    const result = await store.update(catalogue)

    expect(result).toEqual(catalogue)
    expect(catalogueService.update).toHaveBeenCalledWith(catalogue)
  })

  it('should remove a catalogue', async () => {
    const catalogue: Catalogue = {
      id: 1,
      name: 'Stanley Gibbons',
      description: 'British Commonwealth',
      issue: 2023,
      type: CatalogueType.STANLEY_GIBBONS,
      code: CurrencyCode.GBP
    }

    vi.mocked(catalogueService.remove).mockResolvedValue()

    await store.remove(catalogue)

    expect(catalogueService.remove).toHaveBeenCalledWith(catalogue)
  })

  it('should get stamp counts', async () => {
    const mockCounts: CountModel[] = [
      { id: 1, count: 10 },
      { id: 2, count: 5 }
    ]

    vi.mocked(catalogueService.getStampCount).mockResolvedValue(mockCounts)

    const result = await store.getStampCount()

    expect(result).toEqual(mockCounts)
    expect(catalogueService.getStampCount).toHaveBeenCalled()
  })

  it('should find catalogue by id', async () => {
    const mockCatalogues: Catalogue[] = [
      {
        id: 1,
        name: 'Stanley Gibbons',
        description: 'British Commonwealth',
        issue: 2023,
        type: CatalogueType.STANLEY_GIBBONS,
        code: CurrencyCode.GBP
      },
      {
        id: 2,
        name: 'Scott',
        description: 'Scott',
        issue: 2022,
        type: CatalogueType.SCOTT,
        code: CurrencyCode.USD
      }
    ]
    const mockResponse = new EntityList<Catalogue>()
    mockResponse.items = mockCatalogues
    mockResponse.total = mockCatalogues.length

    vi.mocked(catalogueService.find).mockResolvedValue(mockResponse)

    await store.find() // Populate the store
    const result = await store.findById(1)

    expect(result).toBeDefined()
    expect(result.name).toBe('Stanley Gibbons')
  })

  it('should find a random catalogue', async () => {
    const mockCatalogues: Catalogue[] = [
      {
        id: 1,
        name: 'Stanley Gibbons',
        description: 'British Commonwealth',
        issue: 2023,
        type: CatalogueType.STANLEY_GIBBONS,
        code: CurrencyCode.GBP
      }
    ]
    const mockResponse = new EntityList<Catalogue>()
    mockResponse.items = mockCatalogues
    mockResponse.total = mockCatalogues.length

    vi.mocked(catalogueService.find).mockResolvedValue(mockResponse)

    const result = await store.findRandom()

    expect(result).toBeDefined()
    expect(catalogueService.find).toHaveBeenCalled()
  })

  it('should get count', async () => {
    const mockCatalogues: Catalogue[] = [
      {
        id: 1,
        name: 'Stanley Gibbons',
        description: 'British Commonwealth',
        issue: 2023,
        type: CatalogueType.STANLEY_GIBBONS,
        code: CurrencyCode.GBP
      },
      {
        id: 2,
        name: 'Scott',
        description: 'Scott',
        issue: 2022,
        type: CatalogueType.SCOTT,
        code: CurrencyCode.USD
      }
    ]
    const mockResponse = new EntityList<Catalogue>()
    mockResponse.items = mockCatalogues
    mockResponse.total = mockCatalogues.length

    vi.mocked(catalogueService.find).mockResolvedValue(mockResponse)

    await store.find() // Populate the store
    const count = store.getCount()

    expect(count).toBe(2)
  })
})
