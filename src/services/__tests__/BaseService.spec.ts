import { describe, it, expect, beforeEach } from 'vitest'
import BaseService from '../BaseService'
import type { Album } from '@/models/entityModels'

describe('BaseService', () => {
  class MyService extends BaseService<Album> {
    constructor() {
      super()
    }

    getResourceName(): string {
      return 'albums'
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
      const uri = service.createURI(undefined as unknown as object)
      expect(uri).toEqual('/stamp-webservices/rest/albums')
    })

    it('no options with an id', () => {
      const uri = service.createURI(undefined as unknown as object, 42)
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
})
