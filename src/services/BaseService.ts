import merge from 'lodash-es/merge'
import isEmpty from 'lodash-es/isEmpty'

type ServiceHeaders = {
  'Content-Type': string
  [key: string]: string
}

export enum HttpResponseCode {
  HTTP_OK = 200,
  HTTP_CREATED = 201,
  HTTP_NO_CONTENT = 204,
  HTTP_UNAUTHORIZED = 401,
  HTTP_REQUEST_TIMEOUT = 408,
  HTTP_CONFLICT = 409
}

export enum HttpMethod {
  DELETE = 'delete',
  GET = 'get',
  POST = 'post',
  PUT = 'put'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default abstract class BaseService<T> {
  abstract getResourceName(): string

  augmentHeaders(headers?: object): ServiceHeaders {
    const h = headers || {}
    return merge(h, {
      'Content-Type': 'application/json'
    }) as ServiceHeaders
  }

  toParameters(options: Record<string, string | number | boolean> = {}): string {
    let s = ''
    if (options) {
      Object.keys(options).forEach((k, idx) => {
        if (idx > 0) {
          s += '&'
        }
        s += `${k}=${encodeURIComponent(options[k])}`
      })
    }
    return s
  }

  createURI(options: object | undefined, id?: number | string): string {
    let uri = `/stamp-webservices/rest/${this.getResourceName()}`
    if (id) {
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
}
