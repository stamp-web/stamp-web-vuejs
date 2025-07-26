import { defineStore } from 'pinia'

import { baseNamedStoreComposition } from '@/stores/baseNamedStore'
import catalogueService from '@/services/CatalogueService'
import type { Catalogue } from '@/models/Catalogue'
import type { CountModel } from '@/models/countModel'
import type { BaseState } from '@/stores/baseStore'

const baseComposition = baseNamedStoreComposition<Catalogue>({
  service: catalogueService
})

export const catalogueStore = defineStore('catalogueStore', {
  state: () =>
    ({
      items: baseComposition.state.value.items,
      inflightPromise: baseComposition.state.value.inflightPromise,
      lastOptions: baseComposition.state.value.lastOptions
    }) as BaseState<Catalogue>,
  getters: {
    service() {
      return catalogueService
    }
  },

  actions: {
    async find(options?: object): Promise<Catalogue[]> {
      return baseComposition.find(options)
    },
    async findById(id: number): Promise<Catalogue> {
      return baseComposition.findById(id)
    },
    async findRandom(): Promise<Catalogue | undefined> {
      return baseComposition.findRandom()
    },
    async remove(model: Catalogue): Promise<void> {
      return baseComposition.remove(model)
    },
    async create(model: Catalogue): Promise<Catalogue> {
      return baseComposition.create(model)
    },
    async update(model: Catalogue): Promise<Catalogue> {
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
