import type { PersistedNamedModel } from '@/models/entityModels'
import { CountModel } from '@/models/countModel'
import axios from 'axios'
import BaseModelService from '@/services/BaseModelService'
import { findBasePath } from '@/util/href-utils'

export default abstract class BaseManagedService<
  T extends PersistedNamedModel
> extends BaseModelService<T> {
  public overrideBasePath?: string

  private getEffectiveBasePath(): string {
    return this.overrideBasePath ?? findBasePath(window.location.pathname)
  }
  async getStampCount(): Promise<CountModel[]> {
    const basePath = this.getEffectiveBasePath()
    const response = await axios.get(
      `${basePath}stamp-webservices/rest/${this.getResourceName()}/!countStamps`
    )
    return response.data as CountModel[]
  }
}
