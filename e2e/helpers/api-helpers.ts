import { APIRequestContext } from '@playwright/test'
import type {
  Album,
  Catalogue,
  Country,
  PersistedModel,
  PersistedNamedModel,
  Seller,
  StampCollection
} from '../../src/models/entityModels'
import type { Stamp } from '../../src/models/Stamp'

abstract class entityTestHelper<T extends PersistedModel> {
  abstract getResourceName(): string
  getCollectionName(): string {
    return this.getResourceName()
  }

  async create(request: APIRequestContext, payload: any) {
    const result = await request.post(`/stamp-webservices/rest/${this.getResourceName()}`, {
      data: payload
    })
    await result.json()
    if (result.status() === 201) {
      return result.json()
    } else {
      throw new Error(`code: ${result.status()}, status: ${result.statusText()}`)
    }
  }

  async delete(request: APIRequestContext, id: number) {
    const result = await request.delete(`/stamp-webservices/rest/${this.getResourceName()}/${id}`)
    if (result.status() === 204) {
      return
    } else {
      throw new Error(`code: ${result.status()}, status: ${result.statusText()}`)
    }
  }

  async deleteByName(request: APIRequestContext, name: string) {
    const results = await this.find(request)
    const filtered = results[this.getCollectionName()].filter((obj: T) => {
      return (obj as unknown as PersistedNamedModel).name === name
    })
    await this.delete(request, filtered.shift().id)
  }

  async find(request: APIRequestContext) {
    const result = await request.get(`/stamp-webservices/rest/${this.getResourceName()}`)
    if (result.ok()) {
      return result.json()
    }
  }
}
class stampCollectionTestHelper extends entityTestHelper<StampCollection> {
  getResourceName(): string {
    return 'stampCollections'
  }
}

class albumTestHelper extends entityTestHelper<Album> {
  getResourceName(): string {
    return 'albums'
  }
}

class countryTestHelper extends entityTestHelper<Country> {
  getResourceName(): string {
    return 'countries'
  }
}

class catalogueTestHelper extends entityTestHelper<Catalogue> {
  getResourceName(): string {
    return 'catalogues'
  }
}

class sellerTestHelper extends entityTestHelper<Seller> {
  getResourceName(): string {
    return 'sellers'
  }
}

// @ts-ignore
class stampTestHelper extends entityTestHelper<Stamp> {
  getResourceName(): string {
    return 'stamps'
  }
}

export const StampCollectionTestHelper = new stampCollectionTestHelper()
export const AlbumTestHelper = new albumTestHelper()
export const CountryTestHelper = new countryTestHelper()
export const StampTestHelper = new stampTestHelper()
export const CatalogueTestHelper = new catalogueTestHelper()
export const SellerTestHelper = new sellerTestHelper()
