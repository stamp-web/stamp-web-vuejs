import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import { type Catalogue } from '@/models/Catalogue'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import type BaseManagedService from '@/services/BasedManagedService'
import CatalogueService from '@/services/CatalogueService'

type CatalogueStoreType = PiniaStore<'catalogueStore', {}, {}, {}, BaseNamedModelStore<Catalogue>>

export const catalogueStore = useStore<CatalogueStoreType, BaseNamedModelStore<Catalogue>>(
  'catalogueStore',
  {
    state: {},
    getters: {
      service(): BaseManagedService<Catalogue> {
        return CatalogueService
      }
    }
  },
  baseNamedModelStore<Catalogue>()
)
