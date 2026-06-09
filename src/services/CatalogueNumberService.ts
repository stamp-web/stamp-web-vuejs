import type { CatalogueNumber } from '@/models/CatalogueNumber'
import type { Stamp } from '@/models/Stamp'
import BaseModelService from '@/services/BaseModelService'
import axios, { type AxiosRequestConfig } from 'axios'
import { HttpMethod, HttpResponseCode } from '@/services/BaseService'

class CatalogueNumberService extends BaseModelService<CatalogueNumber> {
  constructor() {
    super()
  }

  getResourceName(): string {
    return 'catalogueNumbers'
  }

  async makeActive(id: number): Promise<Stamp> {
    const config: AxiosRequestConfig = {
      method: HttpMethod.POST,
      headers: this.augmentHeaders()
    }
    return axios(this.createURI(undefined, `${id}/makeActive`), config).then((resp) => {
      if (resp.status === HttpResponseCode.HTTP_OK) {
        return resp.data
      } else {
        return Promise.reject(resp)
      }
    })
  }
}

export default new CatalogueNumberService()
