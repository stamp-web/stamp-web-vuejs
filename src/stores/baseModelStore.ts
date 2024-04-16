import type { PiniaStore } from 'pinia-generic'
import { defineGenericStore } from 'pinia-generic'
import type { PersistedModel } from '@/models/entityModels'
import type BaseModelService from '@/services/BaseModelService'
import { reactive } from 'vue'
import { EntityList } from '@/models/entityList'
import { createInstance } from '@/models/entityModels'
import _isEmpty from 'lodash-es/isEmpty'
import _isEqual from 'lodash-es/isEqual'

export type BaseModelStore<T extends PersistedModel> = PiniaStore<
  'entityModelStore',
  {
    items: { list: Array<T>; total: number; loading: boolean }
    inflightPromise: any
    lastOptions: {}
  },
  {
    service(): BaseModelService<T>
    baseSearchOptions(): {}
  },
  {
    remove(model: T): Promise<void>
    find(options?: any): Promise<T[]>
    findRandom(): Promise<T | undefined>
    create(model: T): Promise<T>
    update(model: T): Promise<T>
    postFind(model: T): T
    getCount(): number
  }
>

export function baseModelStore<T extends PersistedModel>(): any {
  return defineGenericStore<BaseModelStore<T>>({
    state: {
      items: reactive({ list: [] as Array<T>, total: 0, loading: false }),
      inflightPromise: undefined,
      lastOptions: {}
    },
    getters: {
      service(): BaseModelService<T> {
        throw new Error('Must be implemented')
      },
      baseSearchOptions() {
        return {}
      }
    },
    actions: {
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

      // @ts-ignore
      async find(options: {} = this.baseSearchOptions): Promise<T[]> {
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
          const data: EntityList<T> = await this.inflightPromise
          this.items.list.splice(0, this.items.list.length)
          data.items.forEach((e) => {
            e = this.postFind(e)
            this.items.list.push(createInstance(<T>e))
            this.items.total = data.total
          })
          this.items.loading = false
          this.inflightPromise = undefined
        }
        return this.items.list as unknown as T[]
      },
      async findRandom(): Promise<T | undefined> {
        const list = await this.service.find()
        if (list.total > 0) {
          const randomIndex = Math.floor(Math.random() * list.total) + 1
          return list.items[randomIndex]
        }
      },
      postFind(model: T): T {
        return model
      },
      async create(model: T): Promise<T> {
        const m: T = await this.service.create(model)
        const list = this.items.list as T[]
        list.push(m)
        this.items.total++
        return m
      },

      async update(model: T): Promise<T> {
        const m: T = await this.service.update(model)
        let index = this.items.list.findIndex((e) => {
          return e.id === m.id
        })
        if (index < 0) {
          index = this.items.list.length - 1
        }
        const list = this.items.list as T[]
        list.splice(index, 1, m as T)
        return m
      },
      getCount(): number {
        return this.items.total
      }
    }
  })
}
