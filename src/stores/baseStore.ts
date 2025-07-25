import { defineStore } from 'pinia'
import { createInstance, type PersistedModel } from '@/models/entityModels'
import type BaseModelService from '@/services/BaseModelService'
import type { EntityList } from '@/models/entityList'
import type { SearchOptions } from '@/stores/types/searchOptions'
import _isEmpty from 'lodash-es/isEmpty'
import _isEqual from 'lodash-es/isEqual'

export type BaseState<T extends PersistedModel> = {
  items: {
    list: T[]
    total: number
    loading: boolean
  }
  inflightPromise: Promise<EntityList<T>> | null
  lastOptions: SearchOptions
}

export function createBaseStore<T extends PersistedModel>(
  storeId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  service: BaseModelService<T>
) {
  return defineStore(storeId, {
    state: (): BaseState<T> => ({
      items: {
        list: [],
        total: 0,
        loading: false
      },
      inflightPromise: null,
      lastOptions: {}
    }),
    getters: {
      service(): BaseModelService<T> {
        return service
      },
      baseSearchOptions(): SearchOptions {
        return {}
      }
    },

    actions: {
      // Base actions implementation (remove, find, findById, etc.)
      async remove(model: T): Promise<void> {
        const id = model.id
        await this.service.remove(model)
        const indx = this.items.list.findIndex((e) => {
          return e.id === id
        })
        if (indx >= 0) {
          this.items.list.splice(indx, 1)
          this.items.total--
        }
      },
      async find(options?: SearchOptions): Promise<T[]> {
        const searchOptions = options ?? this.baseSearchOptions
        // attempt caching for inflight promises.  This will have to be cancelled
        // for finds that have options
        if (
          this.items.loading &&
          this.inflightPromise &&
          (_isEmpty(searchOptions) || _isEqual(searchOptions, this.lastOptions))
        ) {
          await this.inflightPromise
        }
        if (this.items.list.length === 0 || !_isEqual(searchOptions, this.lastOptions)) {
          this.items.loading = true
          this.lastOptions = searchOptions
          this.inflightPromise = this.service.find(searchOptions)
          const data: EntityList<T> = await this.inflightPromise
          this.items.list.splice(0, this.items.list.length)
          const list = [] as T[]
          data.items.forEach((e) => {
            list.push(createInstance(<T>e))
            this.items.total = data.total
          })
          // @ts-expect-error: so far have not been able to resolve this difference in Typing
          this.items.list = this.postFind(list, searchOptions)
          this.items.loading = false
          this.inflightPromise = null
        }
        return this.items.list as T[]
      },
      async findById(id: number) {
        if (this.items.list.length <= 0 || this.lastOptions.$filter) {
          await this.find()
        }
        return Promise.resolve(this.items.list.find((item) => item.id === id) as T)
      },
      async findRandom(): Promise<T | undefined> {
        const list = await this.service.find()
        if (list.total > 0) {
          const randomIndex = Math.floor(Math.random() * list.total) + 1
          return list.items[randomIndex]
        }
      },
      async create(model: T): Promise<T> {
        const m: T = await this.service.create(model)
        const list = this.items.list as T[]
        list.push(this.postCreate(m))
        this.items.total++
        return m
      },

      async update(model: T): Promise<T> {
        let m: T = await this.service.update(model)
        const index = this.items.list.findIndex((e) => {
          return e.id === m.id
        })
        m = this.postUpdate(m)
        if (index >= 0) {
          ;(this.items.list as Array<T>)[index] = m
        } else {
          ;(this.items.list as Array<T>).push(m)
        }
        return m
      },

      getCount(): number {
        return this.items.total
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      postFind(models: T[], options?: SearchOptions): T[] {
        return models
      },

      /**
       * Post Create hook for modifying the entity after creation.
       * Base implementation simply returns the entity
       *
       * @param model
       * @return the Modified model
       */
      postCreate(model: T): T {
        return model
      },

      /**
       * Post Update hook for modifying the entity after updating.
       * Base implementation simply returns the entity
       *
       * @param model
       * @return the Modified model
       */
      postUpdate(model: T): T {
        return model
      }
    }
  })
}
