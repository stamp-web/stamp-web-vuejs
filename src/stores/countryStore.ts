import { defineStore } from 'pinia'

import { baseNamedStoreComposition } from '@/stores/baseNamedStore'
import countryService from '@/services/CountryService'
import type { Country } from '@/models/entityModels'
import type { CountModel } from '@/models/countModel'

const baseComposition = baseNamedStoreComposition<Country>({
  service: countryService
})

export const countryStore = defineStore('countryStore', {
  state: () => ({
    ...baseComposition.state
  }),
  getters: {
    service() {
      return countryService
    }
  },

  actions: {
    async find(options?: object): Promise<Country[]> {
      return baseComposition.find(options)
    },
    async findById(id: number): Promise<Country> {
      return baseComposition.findById(id)
    },
    async findRandom(): Promise<Country | undefined> {
      return baseComposition.findRandom()
    },
    async remove(model: Country): Promise<void> {
      return baseComposition.remove(model)
    },
    async create(model: Country): Promise<Country> {
      return baseComposition.create(model)
    },
    async update(model: Country): Promise<Country> {
      return baseComposition.update(model)
    },
    getCount(): number {
      return baseComposition.getCount()
    },
    getStampCount(): Promise<CountModel[]> {
      return baseComposition.getStampCount()
    }
  }
})
