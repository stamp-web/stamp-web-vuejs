import type { PersistedNamedModel } from '@/models/entityModels'
import { defineGenericStore, type StoreThis, type PiniaStore } from 'pinia-generic'
import { CountModel } from '@/models/countModel'
import type { BaseModelStore } from '@/stores/baseModelStore'
import BaseManagedService from '@/services/BasedManagedService'
import BaseModelService from '@/services/BaseModelService'
import { baseModelStore } from '@/stores/baseModelStore'
import type { SearchOptions } from '@/stores/types/searchOptions.ts'

export type BaseNamedModelStore<
  T extends PersistedNamedModel,
  Id extends string = string
> = PiniaStore<
  Id,
  {
    items: { list: Array<T>; total: number; loading: boolean }
    inflightPromise: object
    lastOptions: object
  },
  {
    service(): BaseModelService<T>
    baseSearchOptions(): object
  },
  {
    remove(model: T): Promise<void>
    find(options?: SearchOptions): Promise<T[]>
    findById(id: number): Promise<T>
    findRandom(): Promise<T | undefined>
    create(model: T): Promise<T>
    update(model: T): Promise<T>
    getCount(): number
    postFind(models: T[], options?: SearchOptions): T[]
    postCreate(model: T): T
    postUpdate(model: T): T
    getStampCount(): Promise<CountModel[]>
  }
>

export function baseNamedModelStore<T extends PersistedNamedModel, Id extends string = string>() {
  return defineGenericStore<BaseNamedModelStore<T, Id>>(
    {
      getters: {},
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
         * @param options (Optional) object of properties
         */
        postFind(models: T[], options?: SearchOptions): T[] {
          if (!options || (options?.$orderby && options?.$orderby.startsWith('name'))) {
            const m = models.sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )
            if (options && options?.$orderby && options?.$orderby === 'name desc') {
              return m.reverse()
            }
            return m
          }
          return models
        }
      }
    },
    baseModelStore<T, Id>()
  ) as StoreThis<BaseNamedModelStore<T, Id>, BaseModelStore<T, Id>>
}
