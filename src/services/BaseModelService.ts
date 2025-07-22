import type { PersistedModel } from '@/models/entityModels'
import BaseService, { HttpMethod, HttpResponseCode } from '@/services/BaseService'
import { EntityList } from '@/models/entityList'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import requiredId from '@/util/decorators/requiredId'

export default abstract class BaseModelService<T extends PersistedModel> extends BaseService<T> {
   
  async find(options: {} = {}): Promise<EntityList<T>> {
    const response = await axios.get(this.createURI(options))
    const list: EntityList<T> = new EntityList<T>()
    list.items = response.data[this.getCollectionName()]
    list.total = response.data.total
    return list
  }

   
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
