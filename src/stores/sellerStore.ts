import { defineStore } from 'pinia'

import { baseNamedStoreComposition } from '@/stores/baseNamedStore'
import sellerService from '@/services/SellerService'
import type { Seller } from '@/models/entityModels'
import type { CountModel } from '@/models/countModel'
import type { BaseState } from '@/stores/baseStore'

const baseComposition = baseNamedStoreComposition<Seller>({
  service: sellerService
})

export const sellerStore = defineStore('sellerStore', {
  state: () =>
    ({
      items: baseComposition.state.value.items,
      inflightPromise: baseComposition.state.value.inflightPromise,
      lastOptions: baseComposition.state.value.lastOptions
    }) as BaseState<Seller>,
  getters: {
    service() {
      return sellerService
    }
  },

  actions: {
    async find(options?: object): Promise<Seller[]> {
      return baseComposition.find(options)
    },
    async findById(id: number): Promise<Seller> {
      return baseComposition.findById(id)
    },
    async findRandom(): Promise<Seller | undefined> {
      return baseComposition.findRandom()
    },
    async remove(model: Seller): Promise<void> {
      return baseComposition.remove(model)
    },
    async create(model: Seller): Promise<Seller> {
      return baseComposition.create(model)
    },
    async update(model: Seller): Promise<Seller> {
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
