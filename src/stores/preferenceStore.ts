import PreferenceService from '@/services/PreferenceService'
import type { Preference } from '@/models/Preference'

import { defineStore } from 'pinia'
import { type BaseState, baseStoreComposition } from '@/stores/baseStore'
import type { SearchOptions } from '@/stores/types/searchOptions'

const baseComposition = baseStoreComposition<Preference>({
  service: PreferenceService
})

export const preferenceStore = defineStore('preferenceStore', {
  state: () =>
    ({
      items: baseComposition.state.value.items,
      inflightPromise: baseComposition.state.value.inflightPromise,
      lastOptions: baseComposition.state.value.lastOptions
    }) as BaseState<Preference>,
  getters: {
    service() {
      return PreferenceService
    }
  },

  actions: {
    async remove(model: Preference): Promise<void> {
      return baseComposition.remove(model)
    },

    /**
     * Finds preferences based on some find criteria
     *
     * @param options
     */
    async find(options?: object): Promise<Preference[]> {
      return baseComposition.find(options)
    },

    async create(model: Preference): Promise<Preference> {
      return baseComposition.create(model)
    },

    async update(model: Preference): Promise<Preference> {
      return baseComposition.update(model)
    },

    async findByCategory(category: string): Promise<Preference[]> {
      if (this.items.list.length > 0 && !this.lastOptions.$filter) {
        const filtered = this.items.list.filter((p: Preference) => p.category === category)
        return Promise.resolve(filtered)
      } else {
        const params = {} as SearchOptions
        params.$filter = `(category eq '${category}')`
        return this.find(params)
      }
    },
    async findByNameAndCategory(name: string, category: string): Promise<Preference> {
      if (this.items.list.length <= 0 || this.lastOptions.$filter) {
        await this.find()
      }
      return Promise.resolve(
        this.items.list.find(
          (item: Preference) => item.name === name && item.category === category
        ) as Preference
      )
    }
  }
})
