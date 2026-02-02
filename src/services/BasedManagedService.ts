import type { PersistedNamedModel } from '@/models/entityModels'
import { CountModel } from '@/models/countModel'
import axios from 'axios'
import BaseModelService from '@/services/BaseModelService'
import { findBasePath } from '@/util/href-utils'

const basePath = findBasePath(window.location.pathname)

export default abstract class BaseManagedService<
  T extends PersistedNamedModel
> extends BaseModelService<T> {
  async getStampCount(): Promise<CountModel[]> {
    const response = await axios.get(
      `${basePath}stamp-webservices/rest/${this.getResourceName()}/!countStamps`
    )
    const list: CountModel[] = new Array<CountModel>()
    response.data.forEach((item: T) => {
      list.push(item as CountModel)
    })
    return list
  }
}
