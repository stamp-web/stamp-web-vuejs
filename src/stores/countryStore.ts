import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type { Country } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseModelStore } from '@/stores/baseModelStore'
import CountryService from '@/services/CountryService'
import { CountModel } from '@/models/countModel'
import BaseManagedService from '@/services/BasedManagedService'

type CountryStoreType = PiniaStore<
  'countryStore',
  {},
  {},
  {
    getStampCount(): Promise<CountModel[]>
  },
  BaseModelStore<Country>
>

export const countryStore = useStore<CountryStoreType, BaseModelStore<Country>>(
  'countryStore',
  {
    state: {},
    getters: {
      service(): BaseService<Country> {
        return CountryService
      }
    },
    actions: {
      async getStampCount(): Promise<CountModel[]> {
        const counts = await (this.service as BaseManagedService<Country>).getStampCount()
        counts.forEach((cm) => {
          const country = this.items.list.find((c) => c.id === cm.id)
          if (country) {
            country.count = cm.count
          }
        })
        return counts
      }
    }
  },
  baseModelStore<Country>()
)
