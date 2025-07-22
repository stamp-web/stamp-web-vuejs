import type { PiniaStore, StoreThis } from 'pinia-generic'
import { defineGenericStore } from 'pinia-generic'
import type { PersistedModel } from '@/models/entityModels'
import type BaseModelService from '@/services/BaseModelService'
import { reactive } from 'vue'
import type { SearchOptions } from '@/stores/types/searchOptions'
import { EntityList } from '@/models/entityList'
import { createInstance } from '@/models/entityModels'
import _isEmpty from 'lodash-es/isEmpty'
import _isEqual from 'lodash-es/isEqual'

export type BaseModelStore<T extends PersistedModel, Id extends string = string> = PiniaStore<
  Id,
  {
    items: { list: Array<T>; total: number; loading: boolean }
    inflightPromise: Promise<EntityList<T>> | null
    lastOptions: SearchOptions
  },
  {
    service(): BaseModelService<T>
    baseSearchOptions(): SearchOptions
  },
  {
    remove(model: T): Promise<void>
    find(options?: SearchOptions): Promise<T[]>
    findById(id: number): Promise<T>
    findRandom(): Promise<T | undefined>
    create(model: T): Promise<T>
    update(model: T): Promise<T>
    getCount(): number
    postFind(models: T[], options?: SearchOptions): T[]
    postCreate(model: T): T
    postUpdate(model: T): T
  }
>

export function baseModelStore<T extends PersistedModel, Id extends string = string>(): StoreThis<
  BaseModelStore<T, Id>
> {
  return defineGenericStore<BaseModelStore<T, Id>>({
    state: () => ({
      items: reactive({ list: [] as Array<T>, total: 0, loading: false }),
      inflightPromise: null,
      lastOptions: {}
    }),
    getters: {
      service(): BaseModelService<T> {
        throw new Error('Must be implemented')
      },
      baseSearchOptions(): SearchOptions {
        return {}
      }
    },
    actions: {
      async remove(model: T): Promise<void> {
        const id = model.id
        await this.service.remove(model)
        const indx = (this.items.list as T[]).findIndex((e) => {
          return e.id === id
        })
        if (indx >= 0) {
          this.items.list.splice(indx, 1)
          this.items.total--
        }
      },

      async find(options: SearchOptions): Promise<T[]> {
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
          const list = new Array<T>()
          ;(data.items as T[]).forEach((e) => {
            list.push(createInstance(e))
            this.items.total = data.total
          })
          this.items.list = this.postFind(list, options)
          this.items.loading = false
          this.inflightPromise = null
        }
        return this.items.list as T[]
      },
      async findById(id) {
        const list = this.items.list as T[]
        if (this.items.list.length <= 0 || this.lastOptions.$filter) {
          await this.find()
        }
        const item = this.items.list.find((item: T) => item.id === id)
        if (!item) {
          throw new Error(`Item with id ${id} not found`)
        }
        return Promise.resolve(item)
      },
      async findRandom(): Promise<T | undefined> {
        const list = await this.service.find()
        if (list.total > 0) {
          const randomIndex = Math.floor(Math.random() * list.total)
          return list.items[randomIndex]
        }
        return undefined
      },
      async create(model: T): Promise<T> {
        const m = await this.service.create(model)
        const list = this.items.list as T[]
        list.push(this.postCreate(m))
        this.items.total++
        return m
      },

      async update(model: T): Promise<T> {
        let m = await this.service.update(model)
        const list = this.items.list as T[]
        const index = list.findIndex((e) => e.id === m.id)
        m = this.postUpdate(m)
        if (index >= 0) {
          list[index] = m
        } else {
          list.push(m)
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
