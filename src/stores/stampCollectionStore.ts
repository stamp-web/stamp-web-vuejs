import { defineStore } from 'pinia'

import { baseNamedStoreComposition } from '@/stores/baseNamedStore'
import stampCollectionService from '@/services/StampCollectionService'
import type { StampCollection } from '@/models/entityModels'
import type { CountModel } from '@/models/countModel'
import type { BaseState } from '@/stores/baseStore'

const baseComposition = baseNamedStoreComposition<StampCollection>({
  service: stampCollectionService
})

export const stampCollectionStore = defineStore('stampCollectionStore', {
  state: () =>
    ({
      items: baseComposition.state.value.items,
      inflightPromise: baseComposition.state.value.inflightPromise,
      lastOptions: baseComposition.state.value.lastOptions
    }) as BaseState<StampCollection>,
  getters: {
    service() {
      return stampCollectionService
    }
  },

  actions: {
    async find(options?: object): Promise<StampCollection[]> {
      return baseComposition.find(options)
    },
    async findById(id: number): Promise<StampCollection> {
      return baseComposition.findById(id)
    },
    async findRandom(): Promise<StampCollection | undefined> {
      return baseComposition.findRandom()
    },
    async remove(model: StampCollection): Promise<void> {
      return baseComposition.remove(model)
    },
    async create(model: StampCollection): Promise<StampCollection> {
      return baseComposition.create(model)
    },
    async update(model: StampCollection): Promise<StampCollection> {
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
