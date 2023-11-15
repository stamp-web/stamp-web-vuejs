import { describe, it, expect, beforeEach, vi } from 'vitest'
import BaseService from '../BaseService'
import type { Album } from '@/models/entityModels'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { EntityList } from '../../models/entityList'

describe('BaseService', () => {
  class MyService extends BaseService<Album> {
    constructor() {
      super()
    }

    protected getResourceName(): string {
      return 'albums'
    }
  }

  class MyAxiosResponse implements AxiosResponse<any> {
    // @ts-ignore
    config: InternalAxiosRequestConfig<any> = undefined
    data: any
    // @ts-ignore
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders
    status: number
    statusText: string = ''

    constructor(status: number, data: any) {
      this.status = status
      this.data = data
    }
  }

  let service: BaseService<Album>

  beforeEach(() => {
    service = new MyService()
  })

  describe('toParameters', () => {
    it('empty params', () => {
      const s = service.toParameters({})
      expect(s).toEqual('')
    })
    it('null params', () => {
      const s = service.toParameters(null as unknown as Object)
      expect(s).toEqual('')
    })
    it('undefined params', () => {
      const s = service.toParameters(undefined as unknown as Object)
      expect(s).toEqual('')
    })
    it('single param', () => {
      const s = service.toParameters({ key: 'value' })
      expect(s).toEqual('key=value')
    })
    it('single param encoded', () => {
      const s = service.toParameters({ key: 'blue & red' })
      expect(s).toEqual('key=blue%20%26%20red')
    })
    it('multiple params', () => {
      const s = service.toParameters({ key: 'v1', foo: 'baz', bar: 42 })
      expect(s.length).toBe(21) // key=v1&foo=baz&bar=42
      const parts: string[] = s.split('&')
      expect(parts.length).toBe(3)
    })
  })

  describe('createURI', () => {
    it('no options and no id', () => {
      const uri = service.createURI(undefined as unknown as Object)
      expect(uri).toEqual('/stamp-webservices/rest/albums')
    })

    it('no options with an id', () => {
      const uri = service.createURI(undefined as unknown as Object, 42)
      expect(uri).toEqual('/stamp-webservices/rest/albums/42')
    })

    it('with options and an id', () => {
      const uri = service.createURI({ key: 'value' }, 42)
      expect(uri).toEqual('/stamp-webservices/rest/albums/42?key=value')
    })

    it('with options and no id', () => {
      const uri = service.createURI({ key: 'red and blue' })
      expect(uri).toEqual('/stamp-webservices/rest/albums?key=red%20and%20blue')
    })
  })

  describe('getCollectionName', () => {
    it('verify', () => {
      expect(service.getCollectionName()).toEqual('albums')
    })
  })

  describe('augmentHeaders', () => {
    it('no headers', () => {
      const h = service.augmentHeaders()
      expect(h['Content-Type']).toBe('application/json')
    })

    it('with headers', () => {
      const h = service.augmentHeaders({
        Accepts: 'application/json'
      })
      expect(Object.keys(h).length).toBe(2)
      expect(h['Content-Type']).toBe('application/json')
      expect(h['Accepts']).toBe('application/json')
    })
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
      // @ts-ignore
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
      // @ts-ignore
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
      // @ts-ignore
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
      // @ts-ignore
      axios.mockReturnValue(Promise.resolve(new MyAxiosResponse(200, model)))

      const album: Album = await service.update(model)
      expect(album.id).toBe(42)
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mock('axios')
      // @ts-ignore
    })

    it('simple remove', async () => {
      const model = { id: 42, name: 'test-1', stampCollectionRef: 1, description: '' }
      // @ts-ignore
      axios.delete.mockReturnValue(Promise.resolve(new MyAxiosResponse(204)))
      await service.remove(model)
      expect(axios.delete).toHaveBeenCalledOnce()
    })

    it('non-persisted model', async () => {
      const model = { id: 0, name: 'test-1', stampCollectionRef: 1, description: '' }
      // @ts-ignore
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
