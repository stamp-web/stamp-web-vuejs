import BaseService from '@/services/BaseService'
import type { PersistedNamedModel } from '@/models/entityModels'
import { CountModel } from '@/models/countModel'
import axios from 'axios'

export default abstract class BaseManagedService<
  T extends PersistedNamedModel
> extends BaseService<T> {
  async getStampCount(): Promise<CountModel[]> {
    const response = await axios.get(
      `/stamp-webservices/rest/${this.getResourceName()}/!countStamps`
    )
    const list: CountModel[] = new Array<CountModel>()
    // @ts-ignore
    response.data.forEach((item) => {
      list.push(item as CountModel)
    })
    return list
  }
}
