import type { SearchOptions } from '@/stores/types/searchOptions'
import { baseStoreComposition, type BaseStoreOptions } from '@/stores/baseStore'
import type BaseManagedService from '@/services/BasedManagedService'
import { type PersistedNamedModel } from '@/models/entityModels'
import { CountModel } from '@/models/countModel'

export type BaseNamedStoreOptions<T extends PersistedNamedModel> = BaseStoreOptions<T> & {
  service: BaseManagedService<T>
}

export function baseNamedStoreComposition<T extends PersistedNamedModel>(
  options: BaseNamedStoreOptions<T>
) {
  options.baseSearchOptions = options.baseSearchOptions ?? {
    $orderby: 'name asc'
  }

  options.postFind =
    options.postFind ??
    ((models: T[], options?: SearchOptions): T[] => {
      if (!options || options.$orderby?.startsWith('name')) {
        const m = models.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        if (options && options.$orderby === 'name desc') {
          return m.reverse()
        }
        return m
      }
      return models
    })

  const baseComposition = baseStoreComposition<T>(options)

  async function getStampCount(): Promise<CountModel[]> {
    const counts = await (baseComposition.service as BaseManagedService<T>).getStampCount()
    counts.forEach((cm) => {
      const item = baseComposition.state.value.items.list.find((c: T) => {
        return c.id === cm.id
      })
      if (item) {
        item.count = cm.count
      }
    })
    return counts
  }

  return {
    ...baseComposition,
    getStampCount
  }
}
