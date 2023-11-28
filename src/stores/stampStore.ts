import type { Stamp } from '@/models/Stamp'
import StampService from '@/services/StampService'
import { reactive } from 'vue'
import { EntityList } from '@/models/entityList'
import BaseService from '@/services/BaseService'
import { defineStore } from 'pinia'
import type { CatalogueNumber } from '@/models/CatalogueNumber'

export const stampStore = defineStore('stampStore', {
  state: () => {
    return {
      items: reactive({ list: new Array<Stamp>(), total: 0, loading: false }),
      lastOptions: {}
    }
  },
  getters: {
    service(): BaseService<Stamp> {
      return StampService
    }
  },
  actions: {
    async remove(model: Stamp): Promise<void> {
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
    async find(options?: {}): Promise<Array<Stamp>> {
      this.items.list.splice(0, this.items.list.length)
      this.items.loading = true
      const data: EntityList<Stamp> = await this.service.find(options)
      data.items.forEach((e) => {
        const activeCN = e.catalogueNumbers.find((cn: CatalogueNumber) => {
          return cn.active
        })
        e.activeCatalogueNumber = activeCN
        this.items.list.push(e)
        this.items.total = data.total
      })
      this.items.loading = false
      return this.items.list
    },
    async create(model: Stamp): Promise<Stamp> {
      const m: Stamp = await this.service.create(model)
      const list = this.items.list
      list.push(m)
      this.items.total++
      return m
    },

    async update(model: Stamp): Promise<Stamp> {
      const m: Stamp = await this.service.update(model)
      let index = this.items.list.findIndex((e) => {
        return e.id === m.id
      })
      if (index < 0) {
        index = this.items.list.length - 1
      }
      const list = this.items.list
      list.splice(index, 1, m)
      return m
    }
  }
})
