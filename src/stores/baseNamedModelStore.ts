import type { PersistedNamedModel } from '@/models/entityModels'
import { defineGenericStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import { CountModel } from '@/models/countModel'
import type { BaseModelStore } from '@/stores/baseModelStore'
import BaseManagedService from '@/services/BasedManagedService'
import { baseModelStore } from '@/stores/baseModelStore'
import type { SearchOptions } from '@/stores/types/searchOptions'

export type BaseNamedModelStore<T extends PersistedNamedModel> = PiniaStore<
  'entityNamedModelStore',
  object,
  { baseSearchOptions(): object },
  {
    getStampCount(): Promise<CountModel[]>
  },
  BaseModelStore<T>
>

export function baseNamedModelStore<T extends PersistedNamedModel>() {
  return defineGenericStore<BaseNamedModelStore<T>, BaseModelStore<T>>(
    {
      getters: {
        baseSearchOptions(): object {
          return {
            $orderby: 'name asc'
          }
        }
      },
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
        },

        /**
         * For Named entities ensure the list is returned sorted by name
         * @override
         * @param models
         */
        postFind(models: T[], options?: SearchOptions): T[] {
          if (!options || options.$orderby?.startsWith('name')) {
            const m = models.sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )
            if (options && options.$orderby === 'name desc') {
              return m.reverse()
            }
            return m
          }
          return models
        }
      }
    },
    baseModelStore<T>()
  )
}
