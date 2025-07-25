import { defineStore, type Store } from 'pinia'
import _cloneDeep from 'lodash-es/cloneDeep'

import type { Stamp } from '@/models/Stamp'
import { type BaseState, createBaseStore } from '@/stores/baseStore'
import type { CatalogueNumber } from '@/models/CatalogueNumber'
import StampService from '@/services/StampService'
import { ConditionHelper } from '@/models/Condition'
import { catalogueStore } from '@/stores/catalogueStore'
import type { EntityList } from '@/models/entityList'
import { Operators, Predicate } from 'odata-filter-parser'
import { PredicateUtilities } from '@/util/predicate-util'
import BaseModelService from '@/services/BaseModelService'
import type { SearchOptions } from '@/stores/types/searchOptions'

const stampService = StampService
const baseStore = createBaseStore<Stamp>('nonStampStore', stampService)
const baseStoreInstance = baseStore()

export const setActiveCatalogueNumber = (s: Stamp): Stamp => {
  const activeCN = s.catalogueNumbers?.find((cn: CatalogueNumber) => {
    return cn.active
  })
  s.activeCatalogueNumber = activeCN
  return s
}

const createFilter = (stamp: Stamp, cn: CatalogueNumber): object => {
  const searchCriteria = [
    new Predicate({
      subject: 'countryRef',
      operator: Operators.EQUAL,
      value: stamp.countryRef
    }),
    new Predicate({
      subject: 'number',
      operator: Operators.EQUAL,
      value: cn.number
    })
  ]
  return {
    $filter: PredicateUtilities.concat(Operators.AND, searchCriteria).serialize()
  }
}

export const stampStore = defineStore('stampStore', {
  state: () => ({
    ...baseStoreInstance.$state
  }),
  getters: {
    service() {
      return StampService
    },
    baseSearchOptions() {
      return baseStoreInstance.baseSearchOptions
    }
  },

  actions: {
    remove(model: Stamp): Promise<void> {
      return baseStoreInstance.remove(model)
    },

    // Stamp-specific actions

    /**
     * Find stamps based on the options specified.  Since the stamp store is a filtered store/query and not
     * typically queried without filter criteria, the baseModelStore find is insufficient currently.
     * A redesign would be needed to address this fully.
     *
     * @override
     * @param options
     */
    async find(options?: object): Promise<Array<Stamp>> {
      this.items.list.splice(0, this.items.list.length)
      this.items.loading = true
      const data: EntityList<Stamp> = await this.service.find(options)
      const list = new Array<Stamp>()
      data.items.forEach((e) => {
        e = setActiveCatalogueNumber(e)
        list.push(e)
      })
      this.items.total = data.total
      this.items.list = list
      this.items.loading = false
      return _cloneDeep(this.items.list)
    },

    create(model: Stamp): Promise<Stamp> {
      return baseStoreInstance.create(model)
    },
    update(model: Stamp): Promise<Stamp> {
      return baseStoreInstance.update(model)
    },
    getCount(): number {
      return baseStoreInstance.getCount()
    },

    /**
     * Will set the active catalogue number post creation of the stamp.
     *
     * @override
     * @param stamp
     */
    postCreate(stamp: Stamp): Stamp {
      return setActiveCatalogueNumber(stamp)
    },

    /**
     * Will set the active catalogue number post update of the stamp.
     *
     * @override
     * @param stamp
     */
    postUpdate(stamp: Stamp): Stamp {
      return setActiveCatalogueNumber(stamp)
    },

    async checkIfExists(stamp: Stamp, cn: CatalogueNumber): Promise<boolean> {
      let result = false
      const validId = stamp && (!stamp.id || stamp.id <= 0)
      if (
        validId &&
        stamp.countryRef > 0 &&
        cn &&
        cn.number &&
        cn.catalogueRef > 0 &&
        cn.condition >= 0
      ) {
        const results = await this.find(createFilter(stamp, cn))
        if (results && results.length > 0) {
          // need to define catalogueStore( ) here since defining it more globally leads to pinia errors in the unit tests
          const catalogues = await catalogueStore().find()
          const currentCatalogue = catalogues.find((c) => c.id === cn.catalogueRef)
          results.forEach((s: Stamp) => {
            const cId = s.activeCatalogueNumber?.catalogueRef
            const cat = catalogues.find((c) => c.id === cId)
            if (cat && currentCatalogue && cat.type === currentCatalogue.type) {
              const cont = s.activeCatalogueNumber?.condition
              if (cat.type === currentCatalogue.type && cont) {
                if (ConditionHelper.isSameFamily(cn.condition, cont)) {
                  result = true
                }
              }
            }
          })
        }
      }
      return result
    }
  }
})
