import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { albumStore } from '@/stores/albumStore'
import albumService from '@/services/AlbumService'
import type { Album } from '@/models/entityModels'
import type { CountModel } from '@/models/countModel'
import { EntityList } from '@/models/entityList'

vi.mock('@/services/AlbumService', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getStampCount: vi.fn()
  }
}))

describe('albumStore', () => {
  let store: ReturnType<typeof albumStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = albumStore()

    vi.mocked(albumService.find).mockReset()
    vi.mocked(albumService.create).mockReset()
    vi.mocked(albumService.update).mockReset()
    vi.mocked(albumService.remove).mockReset()

    // we cache $filter so we need to force clear it
    await store.find({
      $filter: "(name eq 'Clear it')"
    })
  })

  it('should find countries with default sort', async () => {
    const mockAlbums: Album[] = [
      { id: 1, name: 'USA', description: 'United States', stampCollectionRef: 1 },
      { id: 2, name: 'Canada', description: 'Canada', stampCollectionRef: 1 }
    ]
    const mockResponse = new EntityList<Album>()
    mockResponse.items = mockAlbums
    mockResponse.total = mockAlbums.length

    vi.mocked(albumService.find).mockResolvedValue(mockResponse)

    const result = await store.find()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Canada')
    expect(albumService.find).toHaveBeenCalled()
  })

  it('should find countries with ascending name sort', async () => {
    const mockAlbums: Album[] = [
      { id: 1, name: 'USA', description: 'United States', stampCollectionRef: 1 },
      { id: 2, name: 'Canada', description: 'Canada', stampCollectionRef: 1 }
    ]
    const mockResponse = new EntityList<Album>()
    mockResponse.items = mockAlbums
    mockResponse.total = mockAlbums.length

    vi.mocked(albumService.find).mockResolvedValue(mockResponse)

    const result = await store.find({ $orderby: 'name asc' })

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Canada')
    expect(albumService.find).toHaveBeenCalled()
  })

  it('should create a country', async () => {
    const newAlbum: Album = { id: 3, name: 'Mexico', description: 'Mexico', stampCollectionRef: 3 }
    const createdAlbum: Album = { ...newAlbum }

    vi.mocked(albumService.create).mockResolvedValue(createdAlbum)

    const result = await store.create(newAlbum)

    expect(result).toEqual(createdAlbum)
    expect(albumService.create).toHaveBeenCalledWith(newAlbum)
  })

  it('should update a album', async () => {
    const album: Album = {
      id: 1,
      name: 'USA',
      description: 'Updated description',
      stampCollectionRef: 1
    }

    vi.mocked(albumService.update).mockResolvedValue(album)

    const result = await store.update(album)

    expect(result).toEqual(album)
    expect(albumService.update).toHaveBeenCalledWith(album)
  })

  it('should remove an album', async () => {
    const album: Album = { id: 1, name: 'USA', description: 'United States', stampCollectionRef: 1 }

    vi.mocked(albumService.remove).mockResolvedValue()

    await store.remove(album)

    expect(albumService.remove).toHaveBeenCalledWith(album)
  })

  it('should get album counts', async () => {
    const mockCounts: CountModel[] = [
      { id: 1, count: 10 },
      { id: 2, count: 5 }
    ]

    vi.mocked(albumService.getStampCount).mockResolvedValue(mockCounts)

    const result = await store.getStampCount()

    expect(result).toEqual(mockCounts)
    expect(albumService.getStampCount).toHaveBeenCalled()
  })

  it('should find album by id', async () => {
    const mockAlbums: Album[] = [
      { id: 1, name: 'USA', description: 'United States', stampCollectionRef: 1 },
      { id: 2, name: 'Canada', description: 'Canada', stampCollectionRef: 1 }
    ]
    const mockResponse = new EntityList<Album>()
    mockResponse.items = mockAlbums
    mockResponse.total = mockAlbums.length

    vi.mocked(albumService.find).mockResolvedValue(mockResponse)

    await store.find() // Populate the store
    const result = await store.findById(1)

    expect(result).toBeDefined()
    expect(result.name).toBe('USA')
  })

  it('should find a random album', async () => {
    const mockAlbums: Album[] = [
      { id: 1, name: 'USA', description: 'United States', stampCollectionRef: 1 }
    ]
    const mockResponse = new EntityList<Album>()
    mockResponse.items = mockAlbums
    mockResponse.total = mockAlbums.length

    vi.mocked(albumService.find).mockResolvedValue(mockResponse)

    const result = await store.findRandom()

    expect(result).toBeDefined()
    expect(albumService.find).toHaveBeenCalled()
  })

  it('should get count', async () => {
    const mockAlbums: Album[] = [
      { id: 1, name: 'USA', description: 'United States', stampCollectionRef: 1 },
      { id: 2, name: 'Europe', description: 'European', stampCollectionRef: 2 }
    ]
    const mockResponse = new EntityList<Album>()
    mockResponse.items = mockAlbums
    mockResponse.total = mockAlbums.length

    vi.mocked(albumService.find).mockResolvedValue(mockResponse)

    await store.find()
    const count = store.getCount()

    expect(count).toBe(2)
  })
})
