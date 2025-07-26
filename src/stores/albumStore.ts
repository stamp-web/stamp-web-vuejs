import { defineStore } from 'pinia'

import { baseNamedStoreComposition } from '@/stores/baseNamedStore'
import albumService from '@/services/AlbumService'
import type { Album } from '@/models/entityModels'
import type { CountModel } from '@/models/countModel'
import type { BaseState } from '@/stores/baseStore'

const baseComposition = baseNamedStoreComposition<Album>({
  service: albumService
})

export const albumStore = defineStore('albumStore', {
  state: () =>
    ({
      items: baseComposition.state.value.items,
      inflightPromise: baseComposition.state.value.inflightPromise,
      lastOptions: baseComposition.state.value.lastOptions
    }) as BaseState<Album>,
  getters: {
    service() {
      return albumService
    }
  },

  actions: {
    async find(options?: object): Promise<Album[]> {
      return baseComposition.find(options)
    },
    async findById(id: number): Promise<Album> {
      return baseComposition.findById(id)
    },
    async findRandom(): Promise<Album | undefined> {
      return baseComposition.findRandom()
    },
    async remove(model: Album): Promise<void> {
      return baseComposition.remove(model)
    },
    async create(model: Album): Promise<Album> {
      return baseComposition.create(model)
    },
    async update(model: Album): Promise<Album> {
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
