import axios from 'axios'

import { EntityList } from '@/models/entityList'
import type { PersistedNamedModel } from '@/models/entityModels'

enum HttpResponseCodes {
  HTTP_OK = 200,
  HTTP_CREATED = 201,
  HTTP_NO_CONTENT = 204,
  HTTP_UNAUTHORIZED = 401,
  HTTP_REQUEST_TIMEOUT = 408,
  HTTP_CONFLICT = 409
}

export default abstract class BaseService<T extends PersistedNamedModel> {
  abstract getResourceName(): string

  getCollectionName(): string {
    return this.getResourceName()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(options: {} = {}): Promise<EntityList<T>> {
    const response = await axios.get(`/stamp-webservices/rest/${this.getResourceName()}`)
    const list: EntityList<T> = new EntityList<T>()
    list.items = response.data[this.getCollectionName()]
    list.total = response.data.total
    return list
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(model: Object, opts?: Object): Promise<T> {
    return axios
      .post(`/stamp-webservices/rest/${this.getResourceName()}`, model, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((resp) => {
        if (resp.status === HttpResponseCodes.HTTP_CREATED) {
          return resp.data
        }
      })
  }

  async remove(model: T): Promise<void> {
    const id = model.id
    if (id <= 0) {
      return Promise.reject('Must provide an id')
    }
    return axios
      .delete(`/stamp-webservices/rest/${this.getResourceName()}/${model.id}`)
      .then((resp) => {
        if (resp.status === HttpResponseCodes.HTTP_NO_CONTENT) {
          return Promise.resolve()
        }
      })
  }
}
