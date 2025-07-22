import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import { type Catalogue } from '@/models/Catalogue'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import type BaseManagedService from '@/services/BasedManagedService'
import CatalogueService from '@/services/CatalogueService'

const storeId = 'catalogueStore' as const

type CatalogueStoreType = PiniaStore<
  typeof storeId,
  object,
  object,
  object,
  BaseNamedModelStore<Catalogue, typeof storeId>
>

export const catalogueStore = useStore<
  CatalogueStoreType,
  BaseNamedModelStore<Catalogue, typeof storeId>
>(
  storeId,
  {
    state: {},
    getters: {
      service(): BaseManagedService<Catalogue> {
        return CatalogueService
      },
      baseSearchOptions(): object {
        return { $orderby: 'name asc' }
      }
    }
  },
  // @ts-expect-error: it is expecting a Store
  baseNamedModelStore<Catalogue, storeId>()
)
