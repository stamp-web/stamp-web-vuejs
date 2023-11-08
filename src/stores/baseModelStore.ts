import type { PiniaStore } from 'pinia-generic'
import { defineGenericStore } from 'pinia-generic'
import type { PersistedNamedModel } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { reactive } from 'vue'
import { EntityList } from '@/models/entityList'
import { createInstance } from '@/models/entityModels'
import _sortedIndexBy from 'lodash/sortedIndexBy'

export type BaseModelStore<T extends PersistedNamedModel> = PiniaStore<
  'entityModelStore',
  {
    items: { list: Array<T>; total: number; loading: boolean }
  },
  {
    service(): BaseService<T>
  },
  {
    remove(model: T): Promise<void>
    find(): Promise<T[]>
    create(model: T): Promise<T>
  }
>

export function baseModelStore<T extends PersistedNamedModel>() {
  return defineGenericStore<BaseModelStore<T>>({
    state: {
      items: reactive({ list: [] as Array<T>, total: 0, loading: false })
    },
    getters: {
      service(): BaseService<T> {
        throw new Error('Must be implemented')
      }
    },
    actions: {
      async remove(model: T): Promise<void> {
        const id = model.id
        return this.service.remove(model).then(() => {
          const indx = this.items.list.findIndex((e) => {
            return e.id === id
          })
          if (indx >= 0) {
            this.items.list.splice(indx, 1)
            this.items.total--
          }
          return Promise.resolve()
        })
      },
      async find(): Promise<T[]> {
        if (this.items.list.length === 0) {
          this.items.loading = true
          const data: EntityList<T> = await this.service.find()
          this.items.list.splice(0, this.items.list.length)
          data.items.forEach((e) => {
            this.items.list.push(createInstance(<T>e))
            this.items.total = data.total
            this.items.loading = false
          })
        }
        return Promise.resolve(this.items.list as unknown as T[])
      },
      async create(model: T): Promise<T> {
        const m: T = await this.service.create(model)
        let index = _sortedIndexBy(this.items.list as T[], m, (m: T) => m)
        if (index < 0) {
          index = this.items.list.length - 1
        }
        const list = this.items.list as T[]
        list.splice(index, 0, m as T)
        this.items.total++
        return m
      }
    }
  })
}
