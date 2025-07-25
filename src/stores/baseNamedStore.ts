import { defineStore } from 'pinia'
import type { PersistedNamedModel } from '@/models/entityModels'
import { type BaseState, createBaseStore } from '@/stores/baseStore'
import type BaseManagedService from '@/services/BasedManagedService'
import type { SearchOptions } from '@/stores/types/searchOptions'

export function createNamedStore<T extends PersistedNamedModel>(
  storeId: string,
  service: BaseManagedService<T>
) {
  const baseStore = createBaseStore<T>(storeId, service)

  return defineStore(storeId, {
    state: (): BaseState<T> => {
      const initialState = baseStore().$state
      return {
        items: {
          // @ts-expect-error: type unwrap problem
          list: [...initialState.items.list],
          total: initialState.items.total,
          loading: initialState.items.loading
        },
        inflightPromise: initialState.inflightPromise,
        lastOptions: { ...initialState.lastOptions }
      }
    },

    actions: {
      ...baseStore(),
      postFind(models: T[], options?: SearchOptions) {
        if (!options || options.$orderby?.startsWith('name') || !models.length) {
          const sortedModels = [...models]
          sortedModels.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            return nameA.localeCompare(nameB)
          })
          if (options?.$orderby === 'name desc') {
            return sortedModels.reverse()
          }
          return sortedModels
        }
        return models
      }
    }
  })
}
