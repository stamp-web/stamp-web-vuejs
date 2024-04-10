import type { PersistedNamedModel } from '@/models/entityModels'
import { defineGenericStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import { CountModel } from '@/models/countModel'
import type { BaseModelStore } from '@/stores/baseModelStore'
import BaseManagedService from '@/services/BasedManagedService'
import { baseModelStore } from '@/stores/baseModelStore'

export type BaseNamedModelStore<T extends PersistedNamedModel> = PiniaStore<
  'entityNamedModelStore',
  {},
  {},
  {
    getStampCount(): Promise<CountModel[]>
  },
  BaseModelStore<T>
>

export function baseNamedModelStore<T extends PersistedNamedModel>(): any {
  return defineGenericStore<BaseNamedModelStore<T>, BaseModelStore<T>>(
    {
      actions: {
        async getStampCount(): Promise<CountModel[]> {
          const counts = await (this.service as BaseManagedService<T>).getStampCount()
          counts.forEach((cm) => {
            const item = this.items.list.find((c) => c.id === cm.id)
            if (item) {
              item.count = cm.count
            }
          })
          return counts
        }
      }
    },
    baseModelStore<T>()
  )
}
