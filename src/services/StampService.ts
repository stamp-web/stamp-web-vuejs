import type { Stamp } from '@/models/Stamp'
import BaseModelService from '@/services/BaseModelService'
import axios, { type AxiosRequestConfig } from 'axios'
import { HttpMethod } from '@/services/BaseService'
import type { CurrencyCode } from '@/models/CurrencyCode'
class StampService extends BaseModelService<Stamp> {
  constructor() {
    super()
  }

  getResourceName(): string {
    return 'stamps'
  }

  purchase(stamps: Stamp[], purchasePrice: number, currencyCode: CurrencyCode): Promise<void> {
    const ids = stamps.map((s) => s.id)
    const config: AxiosRequestConfig = {
      method: HttpMethod.POST,
      data: {
        stamps: ids,
        pricePaid: purchasePrice,
        currencyCode
      },
      headers: this.augmentHeaders()
    }
    return axios(this.createURI(undefined, 'purchase'), config)
  }
}

export default new StampService()
