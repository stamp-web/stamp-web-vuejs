import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type { Catalogue } from '@/models/entityModels'
import { baseModelStore } from '@/stores/baseModelStore'
import type BaseManagedService from '@/services/BasedManagedService'
import CatalogueService from '@/services/CatalogueService'

type CatalogueStoreType = PiniaStore<
  'catalogueStore',
  {},
  {},
  {},
  BaseModelStore<Catalogue>
>

export const catalogueStore = useStore<CatalogueStoreType, BaseModelStore<Catalogue>>(
  'catalogueStore',
  {
    state: {},
    getters: {
      service(): BaseManagedService<Catalogue> {
        return CatalogueService
      }
    }
  },
  baseModelStore<Catalogue>()
)
