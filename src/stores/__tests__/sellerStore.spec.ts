import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { sellerStore } from '@/stores/sellerStore'
import sellerService from '@/services/SellerService'
import type { Seller } from '@/models/entityModels'
import type { CountModel } from '@/models/countModel'
import { EntityList } from '@/models/entityList'

vi.mock('@/services/SellerService', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getStampCount: vi.fn()
  }
}))

describe('sellerStore', () => {
  let store: ReturnType<typeof sellerStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = sellerStore()

    vi.mocked(sellerService.find).mockReset()
    vi.mocked(sellerService.create).mockReset()
    vi.mocked(sellerService.update).mockReset()
    vi.mocked(sellerService.remove).mockReset()

    // we cache $filter so we need to force clear it
    await store.find({
      $filter: "(name eq 'Clear it')"
    })
  })

  it('should find countries with default sort', async () => {
    const mockSellers: Seller[] = [
      { id: 1, name: 'ebay', description: 'United States', stampCollectionRef: 1 },
      { id: 2, name: 'delcampe', description: 'delcampe', stampCollectionRef: 1 }
    ]
    const mockResponse = new EntityList<Seller>()
    mockResponse.items = mockSellers
    mockResponse.total = mockSellers.length

    vi.mocked(sellerService.find).mockResolvedValue(mockResponse)

    const result = await store.find()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('delcampe')
    expect(sellerService.find).toHaveBeenCalled()
  })

  it('should find countries with ascending name sort', async () => {
    const mockSellers: Seller[] = [
      { id: 1, name: 'ebay', description: 'United States', stampCollectionRef: 1 },
      { id: 2, name: 'delcampe', description: 'delcampe', stampCollectionRef: 1 }
    ]
    const mockResponse = new EntityList<Seller>()
    mockResponse.items = mockSellers
    mockResponse.total = mockSellers.length

    vi.mocked(sellerService.find).mockResolvedValue(mockResponse)

    const result = await store.find({ $orderby: 'name asc' })

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('delcampe')
    expect(sellerService.find).toHaveBeenCalled()
  })

  it('should create a country', async () => {
    const newSeller: Seller = { id: 3, name: 'APS', description: 'APS', stampCollectionRef: 3 }
    const createdSeller: Seller = { ...newSeller }

    vi.mocked(sellerService.create).mockResolvedValue(createdSeller)

    const result = await store.create(newSeller)

    expect(result).toEqual(createdSeller)
    expect(sellerService.create).toHaveBeenCalledWith(newSeller)
  })

  it('should update a seller', async () => {
    const seller: Seller = {
      id: 1,
      name: 'ebay',
      description: 'Updated description',
      stampCollectionRef: 1
    }

    vi.mocked(sellerService.update).mockResolvedValue(seller)

    const result = await store.update(seller)

    expect(result).toEqual(seller)
    expect(sellerService.update).toHaveBeenCalledWith(seller)
  })

  it('should remove an seller', async () => {
    const seller: Seller = {
      id: 1,
      name: 'ebay',
      description: 'United States',
      stampCollectionRef: 1
    }

    vi.mocked(sellerService.remove).mockResolvedValue()

    await store.remove(seller)

    expect(sellerService.remove).toHaveBeenCalledWith(seller)
  })

  it('should get seller counts', async () => {
    const mockCounts: CountModel[] = [
      { id: 1, count: 10 },
      { id: 2, count: 5 }
    ]

    vi.mocked(sellerService.getStampCount).mockResolvedValue(mockCounts)

    const result = await store.getStampCount()

    expect(result).toEqual(mockCounts)
    expect(sellerService.getStampCount).toHaveBeenCalled()
  })

  it('should find seller by id', async () => {
    const mockSellers: Seller[] = [
      { id: 1, name: 'ebay', description: 'United States', stampCollectionRef: 1 },
      { id: 2, name: 'delcampe', description: 'delcampe', stampCollectionRef: 1 }
    ]
    const mockResponse = new EntityList<Seller>()
    mockResponse.items = mockSellers
    mockResponse.total = mockSellers.length

    vi.mocked(sellerService.find).mockResolvedValue(mockResponse)

    await store.find() // Populate the store
    const result = await store.findById(1)

    expect(result).toBeDefined()
    expect(result.name).toBe('ebay')
  })

  it('should find a random seller', async () => {
    const mockSellers: Seller[] = [
      { id: 1, name: 'ebay', description: 'United States', stampCollectionRef: 1 }
    ]
    const mockResponse = new EntityList<Seller>()
    mockResponse.items = mockSellers
    mockResponse.total = mockSellers.length

    vi.mocked(sellerService.find).mockResolvedValue(mockResponse)

    const result = await store.findRandom()

    expect(result).toBeDefined()
    expect(sellerService.find).toHaveBeenCalled()
  })

  it('should get count', async () => {
    const mockSellers: Seller[] = [
      { id: 1, name: 'ebay', description: 'United States', stampCollectionRef: 1 },
      { id: 2, name: 'Europe', description: 'European', stampCollectionRef: 2 }
    ]
    const mockResponse = new EntityList<Seller>()
    mockResponse.items = mockSellers
    mockResponse.total = mockSellers.length

    vi.mocked(sellerService.find).mockResolvedValue(mockResponse)

    await store.find()
    const count = store.getCount()

    expect(count).toBe(2)
  })
})
