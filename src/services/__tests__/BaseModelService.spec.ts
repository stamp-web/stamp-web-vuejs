import { describe, it, expect, beforeEach, vi } from 'vitest'
import { type Album, createInstance, type PersistedNamedModel } from '@/models/entityModels'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { EntityList } from '@/models/entityList'
import BaseModelService from '@/services/BaseModelService'

vi.mock('axios', () => {
  const defaultMock = vi.fn()
  const mockObj = {
    default: defaultMock,
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn()
  }
  // Copy methods to the default mock function as well
  Object.assign(defaultMock, mockObj)
  return mockObj
})

describe('BaseModelService', () => {
  class MyService extends BaseModelService<Album> {
    constructor() {
      super()
    }

    protected getResourceName(): string {
      return 'albums'
    }
  }

  type MyAxiosResponse = AxiosResponse<PersistedNamedModel> & {
    data: PersistedNamedModel
    status: number
    statusText: string
  }

  let service: BaseModelService<Album>

  beforeEach(() => {
    service = new MyService()
  })

  describe('find', () => {
    const albums = [
      { id: 2, name: 'test-1', description: 'test-description' },
      { id: 3, name: 'test-2', description: '' }
    ]
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('with empty options', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          albums: albums,
          total: 2
        }
      })
      const results: EntityList<Album> = await service.find({})
      expect(axios.get).toHaveBeenCalled()
      expect(results.total).toBe(2)
      expect(results.items).toStrictEqual(albums)
    })

    it('with no options', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          albums: [albums[0]],
          total: 1
        }
      })
      const results: EntityList<Album> = await service.find()
      expect(axios.get).toHaveBeenCalled()
      expect(results.total).toBe(1)
      expect(results.items).toStrictEqual([albums[0]])
    })
  })

  describe('create', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('simple payload no options', async () => {
      const model = { id: 0, name: 'test-1', stampCollectionRef: 1, description: '' }
      const returnModel = {
        id: 42,
        name: 'test-1',
        stampCollectionRef: 1,
        description: ''
      }
      vi.mocked(axios).mockResolvedValue({
        status: 201,
        data: returnModel
      } as unknown as MyAxiosResponse)

      const album: Album = await service.create(model)
      expect(album.id).toBe(42)
    })
  })

  describe('update', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('simple payload no options', async () => {
      const model = createInstance<Album>({
        id: 42,
        name: 'test-1',
        stampCollectionRef: 1,
        description: ''
      })
      vi.mocked(axios).mockResolvedValue({ status: 200, data: model } as unknown as MyAxiosResponse)
      const album: Album = await service.update(model)
      expect(album.id).toBe(42)
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('simple remove', async () => {
      const model = { id: 42, name: 'test-1', stampCollectionRef: 1, description: '' }
      vi.mocked(axios.delete).mockResolvedValue({
        status: 204,
        data: undefined
      } as unknown as MyAxiosResponse)
      await service.remove(model)
      expect(axios.delete).toHaveBeenCalledOnce()
    })

    it('non-persisted model', async () => {
      const model = { id: 0, name: 'test-1', stampCollectionRef: 1, description: '' }
      vi.mocked(axios.delete).mockResolvedValue({ status: 500 } as unknown as MyAxiosResponse)
      try {
        await service.remove(model)
      } catch (e) {
        expect(e instanceof RangeError).toBe(true)
        expect(axios.delete).not.toHaveBeenCalled()
      }
    })
  })
})
