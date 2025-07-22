import { defineStore } from 'pinia'
import { reactive } from 'vue'

import type { Preference } from '@/models/Preference'
import type { SearchOptions } from '@/stores/types/searchOptions.ts'
import _isEmpty from 'lodash-es/isEmpty'
import _isEqual from 'lodash-es/isEqual'
import { createInstance } from '@/models/entityModels.ts'
import { EntityList } from '@/models/entityList.ts'
import PreferenceService from '@/services/PreferenceService.ts'

export const preferenceStorage = defineStore('preference', {
  state: () => ({
    items: reactive({ list: [] as Array<Preference>, total: 0, loading: false }),
    inflightPromise: Promise<EntityList<Preference>>,
    lastOptions: {} as SearchOptions
  }),
  getters: {
    service(): typeof PreferenceService {
      return PreferenceService
    }
  },
  actions: {
    async find(options: SearchOptions): Promise<Preference[]> {
      if (!options) {
        options = this.baseSearchOptions
      }
      // attempt caching for inflight promises.  This will have to be cancelled
      // for finds that have options
      if (
        this.items.loading &&
        this.inflightPromise &&
        (_isEmpty(options) || _isEqual(options, this.lastOptions))
      ) {
        await this.inflightPromise
      }
      if (this.items.list.length === 0 || !_isEqual(options, this.lastOptions)) {
        this.items.loading = true
        this.lastOptions = options
        this.inflightPromise = this.service.find(options)
        const data = await this.inflightPromise
        this.items.list.splice(0, this.items.list.length)
        const list = new Array<Preference>()
        ;(data.items as Preference[]).forEach((e) => {
          list.push(createInstance(e))
          this.items.total = data.total
        })
        this.items.list = this.postFind(list, options)
        this.items.loading = false
        this.inflightPromise = null
      }
      return this.items.list as Preference[]
    },
    async findByCategory(category: string): Promise<Array<Preference>> {
      if (this.items.list.length > 0 && !this.lastOptions.$filter) {
        const filtered = this.items.list.filter((p: Preference) => p.category === category)
        return Promise.resolve(filtered)
      } else {
        const params = structuredClone(this.baseSearchOptions)
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
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    postFind(models: Preference[], options?: SearchOptions): Preference[] {
      return models
    }
  }
})
