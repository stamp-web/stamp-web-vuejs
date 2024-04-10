import type { PiniaStore } from 'pinia-generic'
import { defineGenericStore } from 'pinia-generic'
import type { PersistedModel } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { nextTick, reactive } from 'vue'
import { EntityList } from '@/models/entityList'
import { createInstance } from '@/models/entityModels'
import _isEmpty from 'lodash-es/isEmpty'

export type BaseModelStore<T extends PersistedModel> = PiniaStore<
  'entityModelStore',
  {
    items: { list: Array<T>; total: number; loading: boolean }
    inflightPromise: any
  },
  {
    service(): BaseService<T>
  },
  {
    remove(model: T): Promise<void>
    find(options?: any): Promise<T[]>
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
      inflightPromise: undefined
    },
    getters: {
      service(): BaseService<T> {
        throw new Error('Must be implemented')
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
      async find(options: {} = {}): Promise<T[]> {
        // attempt caching for inflight promises.  This will have to be cancelled
        // for finds that have options
        if (this.items.loading && this.inflightPromise && _isEmpty(options)) {
          await this.inflightPromise
          await nextTick()
        }
        if (this.items.list.length === 0) {
          this.items.loading = true
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
