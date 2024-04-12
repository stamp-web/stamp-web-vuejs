import type { PersistedNamedModel } from '@/models/entityModels'
import { CountModel } from '@/models/countModel'
import axios from 'axios'
import BaseModelService from '@/services/BaseModelService'

export default abstract class BaseManagedService<
  T extends PersistedNamedModel
> extends BaseModelService<T> {
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
