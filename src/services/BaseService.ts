import axios from 'axios'
import type { RawAxiosRequestHeaders, AxiosRequestConfig } from 'axios'
import merge from 'lodash-es/merge'
import isEmpty from 'lodash-es/isEmpty'

import { EntityList } from '@/models/entityList'
import type { PersistedModel } from '@/models/entityModels'
import requiredId from '@/util/decorators/requiredId'

enum HttpResponseCode {
  HTTP_OK = 200,
  HTTP_CREATED = 201,
  HTTP_NO_CONTENT = 204,
  HTTP_UNAUTHORIZED = 401,
  HTTP_REQUEST_TIMEOUT = 408,
  HTTP_CONFLICT = 409
}

enum HttpMethod {
  DELETE = 'delete',
  GET = 'get',
  POST = 'post',
  PUT = 'put'
}

export default abstract class BaseService<T extends PersistedModel> {
  protected abstract getResourceName(): string

  augmentHeaders(headers?: {}): RawAxiosRequestHeaders {
    const h = headers || {}
    return merge(
      h,
      {
        'Content-Type': 'application/json'
      },
      h
    ) as RawAxiosRequestHeaders
  }

  toParameters(options: Object): string {
    let s = ''
    if (options) {
      Object.keys(options).forEach((k, idx) => {
        if (idx > 0) {
          s += '&'
        }
        // @ts-ignore
        s += `${k}=${encodeURIComponent(options[k])}`
      })
    }
    return s
  }

  createURI(options: Object, id?: number): string {
    let uri = `/stamp-webservices/rest/${this.getResourceName()}`
    if (id && id > 0) {
      uri += `/${id}`
    }
    if (!isEmpty(options)) {
      uri += `?${this.toParameters(options)}`
    }
    return uri
  }

  getCollectionName(): string {
    return this.getResourceName()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(options: {} = {}): Promise<EntityList<T>> {
    const response = await axios.get(this.createURI(options))
    const list: EntityList<T> = new EntityList<T>()
    list.items = response.data[this.getCollectionName()]
    list.total = response.data.total
    return list
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(model: T, options: {} = {}): Promise<T> {
    return this.save(model, options)
  }

  @requiredId
  async update(model: T, options: {} = {}): Promise<T> {
    return this.save(model, options)
  }

  protected async save(model: T, options: {} = {}): Promise<T> {
    const isUpdate = model.id && model.id > 0
    const config: AxiosRequestConfig = {
      method: isUpdate ? HttpMethod.PUT : HttpMethod.POST,
      data: model,
      headers: this.augmentHeaders()
    }
    return axios(this.createURI(options, model.id || 0), config).then((resp) => {
      if (
        resp.status === HttpResponseCode.HTTP_OK ||
        resp.status === HttpResponseCode.HTTP_CREATED
      ) {
        return resp.data
      } else {
        return Promise.reject(resp)
      }
    })
  }

  @requiredId
  async remove(model: T): Promise<void> {
    return axios.delete(this.createURI({}, model.id)).then((resp) => {
      if (resp.status === HttpResponseCode.HTTP_NO_CONTENT) {
        return Promise.resolve()
      }
    })
  }
}
