import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios, {
  type AxiosResponseHeaders,
  type InternalAxiosRequestConfig,
  type RawAxiosResponseHeaders
} from 'axios'
import type { AxiosResponse } from 'axios'

import type { Album } from '@/models/entityModels'
import { EntityList } from '@/models/entityList'
import BaseModelService from '@/services/BaseModelService'

describe('BaseModelService', () => {
  class MyService extends BaseModelService<Album> {
    constructor() {
      super()
    }

    protected getResourceName(): string {
      return 'albums'
    }
  }

  class MyAxiosResponse implements AxiosResponse<unknown, unknown> {
    // @ts-expect-error not practical to configure type
    config: InternalAxiosRequestConfig<unknown>
    data: unknown
    // @ts-expect-error not practical to configure either type
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders
    status: number
    statusText: string = ''

    constructor(status: number, data: unknown) {
      this.status = status
      this.data = data
    }
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
      vi.mock('axios')
    })

    it('with empty options', async () => {
      // @ts-expect-error: reference to mockResolvedValue
      axios.get.mockResolvedValue({
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
      // @ts-expect-error: reference to mockResolvedValue
      axios.get.mockResolvedValue({
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
      vi.mock('axios')
    })

    it('simple payload no options', async () => {
      const model = { id: 0, name: 'test-1', stampCollectionRef: 1, description: '' }
      const returnModel = {
        id: 42,
        name: 'test-1',
        stampCollectionRef: 1,
        description: ''
      }
      // @ts-expect-error: reference to mockReturnValue
      axios.mockReturnValue(Promise.resolve(new MyAxiosResponse(201, returnModel)))

      const album: Album = await service.create(model)
      expect(album.id).toBe(42)
    })
  })

  describe('update', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mock('axios')
    })

    it('simple payload no options', async () => {
      const model = { id: 42, name: 'test-1', stampCollectionRef: 1, description: '' }
      // @ts-expect-error: reference to mockReturnValue
      axios.mockReturnValue(Promise.resolve(new MyAxiosResponse(200, model)))

      const album: Album = await service.update(model)
      expect(album.id).toBe(42)
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mock('axios')
    })

    it('simple remove', async () => {
      const model = { id: 42, name: 'test-1', stampCollectionRef: 1, description: '' }
      // @ts-expect-error: reference to mockReturnValue
      axios.delete.mockReturnValue(Promise.resolve(new MyAxiosResponse(204)))
      await service.remove(model)
      expect(axios.delete).toHaveBeenCalledOnce()
    })

    it('non-persisted model', async () => {
      const model = { id: 0, name: 'test-1', stampCollectionRef: 1, description: '' }
      // @ts-expect-error: reference to mockReturnValue
      axios.delete.mockReturnValue(Promise.resolve(new MyAxiosResponse(500)))
      try {
        await service.remove(model)
      } catch (e) {
        expect(e instanceof RangeError).toBe(true)
        expect(axios.delete).not.toHaveBeenCalled()
      }
    })
  })
})
