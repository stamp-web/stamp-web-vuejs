import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { Country } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import CountryService from '@/services/CountryService'

type CountryStoreType = PiniaStore<'countryStore', {}, {}, {}, BaseNamedModelStore<Country>>

export const countryStore = useStore<CountryStoreType, BaseNamedModelStore<Country>>(
  'countryStore',
  {
    state: {},
    getters: {
      service(): BaseService<Country> {
        return CountryService
      }
    }
  },
  baseNamedModelStore<Country>()
)
