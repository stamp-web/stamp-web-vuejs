import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { stampCollectionStore } from '@/stores/stampCollectionStore'
import stampCollectionService from '@/services/StampCollectionService'
import type { StampCollection } from '@/models/entityModels'
import type { CountModel } from '@/models/countModel'
import { EntityList } from '@/models/entityList'

vi.mock('@/services/StampCollectionService', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getStampCount: vi.fn()
  }
}))

describe('stampCollectionStore', () => {
  let store: ReturnType<typeof stampCollectionStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = stampCollectionStore()

    vi.mocked(stampCollectionService.find).mockReset()
    vi.mocked(stampCollectionService.create).mockReset()
    vi.mocked(stampCollectionService.update).mockReset()
    vi.mocked(stampCollectionService.remove).mockReset()

    // we cache $filter so we need to force clear it
    await store.find({
      $filter: "(name eq 'Clear it')"
    })
  })

  it('should find stampCollections with default sort', async () => {
    const mockStampCollections: StampCollection[] = [
      { id: 1, name: 'USA', description: 'United States' },
      { id: 2, name: 'Japan', description: 'Japan' }
    ]
    const mockResponse = new EntityList<StampCollection>()
    mockResponse.items = mockStampCollections
    mockResponse.total = mockStampCollections.length

    vi.mocked(stampCollectionService.find).mockResolvedValue(mockResponse)

    const result = await store.find()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Japan')
    expect(stampCollectionService.find).toHaveBeenCalled()
  })

  it('should find stampCollections with ascending name sort', async () => {
    const mockStampCollections: StampCollection[] = [
      { id: 1, name: 'USA', description: 'United States' },
      { id: 2, name: 'Japan', description: 'Japan' }
    ]
    const mockResponse = new EntityList<StampCollection>()
    mockResponse.items = mockStampCollections
    mockResponse.total = mockStampCollections.length

    vi.mocked(stampCollectionService.find).mockResolvedValue(mockResponse)

    const result = await store.find({ $orderby: 'name asc' })

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Japan')
    expect(stampCollectionService.find).toHaveBeenCalled()
  })

  it('should create a stampCollection', async () => {
    const newStampCollection: StampCollection = { id: 3, name: 'Mexico', description: 'Mexico' }
    const createdStampCollection: StampCollection = { ...newStampCollection }

    vi.mocked(stampCollectionService.create).mockResolvedValue(createdStampCollection)

    const result = await store.create(newStampCollection)

    expect(result).toEqual(createdStampCollection)
    expect(stampCollectionService.create).toHaveBeenCalledWith(newStampCollection)
  })

  it('should update a stampCollection', async () => {
    const stampCollection: StampCollection = {
      id: 1,
      name: 'USA',
      description: 'Updated description'
    }

    vi.mocked(stampCollectionService.update).mockResolvedValue(stampCollection)

    const result = await store.update(stampCollection)

    expect(result).toEqual(stampCollection)
    expect(stampCollectionService.update).toHaveBeenCalledWith(stampCollection)
  })

  it('should remove a stampCollection', async () => {
    const stampCollection: StampCollection = { id: 1, name: 'USA', description: 'United States' }

    vi.mocked(stampCollectionService.remove).mockResolvedValue()

    await store.remove(stampCollection)

    expect(stampCollectionService.remove).toHaveBeenCalledWith(stampCollection)
  })

  it('should get stamp counts', async () => {
    const mockCounts: CountModel[] = [
      { id: 1, count: 10 },
      { id: 2, count: 5 }
    ]

    vi.mocked(stampCollectionService.getStampCount).mockResolvedValue(mockCounts)

    const result = await store.getStampCount()

    expect(result).toEqual(mockCounts)
    expect(stampCollectionService.getStampCount).toHaveBeenCalled()
  })

  it('should find stampCollection by id', async () => {
    const mockStampCollections: StampCollection[] = [
      { id: 1, name: 'USA', description: 'United States' },
      { id: 2, name: 'Japan', description: 'Japan' }
    ]
    const mockResponse = new EntityList<StampCollection>()
    mockResponse.items = mockStampCollections
    mockResponse.total = mockStampCollections.length

    vi.mocked(stampCollectionService.find).mockResolvedValue(mockResponse)

    await store.find() // Populate the store
    const result = await store.findById(1)

    expect(result).toBeDefined()
    expect(result.name).toBe('USA')
  })

  it('should find a random stampCollection', async () => {
    const mockStampCollections: StampCollection[] = [
      { id: 1, name: 'USA', description: 'United States' }
    ]
    const mockResponse = new EntityList<StampCollection>()
    mockResponse.items = mockStampCollections
    mockResponse.total = mockStampCollections.length

    vi.mocked(stampCollectionService.find).mockResolvedValue(mockResponse)

    const result = await store.findRandom()

    expect(result).toBeDefined()
    expect(stampCollectionService.find).toHaveBeenCalled()
  })

  it('should get count', async () => {
    const mockStampCollections: StampCollection[] = [
      { id: 1, name: 'USA', description: 'United States' },
      { id: 2, name: 'Japan', description: 'Japan' }
    ]
    const mockResponse = new EntityList<StampCollection>()
    mockResponse.items = mockStampCollections
    mockResponse.total = mockStampCollections.length

    vi.mocked(stampCollectionService.find).mockResolvedValue(mockResponse)

    await store.find() // Populate the store
    const count = store.getCount()

    expect(count).toBe(2)
  })
})
