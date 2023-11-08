import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type { Country } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseModelStore } from '@/stores/baseModelStore'
import CountryService from '@/services/CountryService'

type CountryStoreType = PiniaStore<'countryStore', {}, {}, {}, BaseModelStore<Country>>

export const countryStore = useStore<CountryStoreType, BaseModelStore<Country>>(
  'countryStore',
  {
    state: {},
    getters: {
      service(): BaseService<Country> {
        return CountryService
      }
    }
  },
  baseModelStore<Country>()
)
