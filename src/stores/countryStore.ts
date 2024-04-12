import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { Country } from '@/models/entityModels'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import CountryService from '@/services/CountryService'
import type BaseManagedService from '@/services/BasedManagedService'

type CountryStoreType = PiniaStore<'countryStore', {}, {}, {}, BaseNamedModelStore<Country>>

export const countryStore = useStore<CountryStoreType, BaseNamedModelStore<Country>>(
  'countryStore',
  {
    state: {},
    getters: {
      service(): BaseManagedService<Country> {
        return CountryService
      }
    }
  },
  baseNamedModelStore<Country>()
)
