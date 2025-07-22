import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { Country } from '@/models/entityModels'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import CountryService from '@/services/CountryService'
import type BaseManagedService from '@/services/BasedManagedService'

const storeId = 'countryStore' as const

type CountryStoreType = PiniaStore<
  typeof storeId,
  object,
  object,
  object,
  BaseNamedModelStore<Country, typeof storeId>
>

export const countryStore = useStore<
  CountryStoreType,
  BaseNamedModelStore<Country, typeof storeId>
>(
  storeId,
  {
    state: {},
    getters: {
      service(): BaseManagedService<Country> {
        return CountryService
      },
      baseSearchOptions(): object {
        return { $orderby: 'name asc' }
      }
    }
  },
  baseNamedModelStore<Country, typeof storeId>()
)
