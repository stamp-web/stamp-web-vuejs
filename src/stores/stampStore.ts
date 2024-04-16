import type { Stamp } from '@/models/Stamp'
import StampService from '@/services/StampService'
import type { CatalogueNumber } from '@/models/CatalogueNumber'
import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import { baseModelStore } from '@/stores/baseModelStore'
import type { EntityList } from '@/models/entityList'
import BaseModelService from '@/services/BaseModelService'

type StampStoreType = PiniaStore<'stampStore', {}, {}, {}, BaseModelStore<Stamp>>

export const setActiveCatalogueNumber = (s: Stamp): Stamp => {
  const activeCN = s.catalogueNumbers?.find((cn: CatalogueNumber) => {
    return cn.active
  })
  s.activeCatalogueNumber = activeCN
  return s
}
export const stampStore = useStore<StampStoreType, BaseModelStore<Stamp>>(
  'stampStore',
  {
    state: {},
    getters: {
      service(): BaseModelService<Stamp> {
        return StampService
      }
    },
    actions: {
      /**
       * Find stamps based on the options specified.  Since the stamp store is a filtered store/query and not
       * typically queried without filter criteria, the baseModelStore find is insufficient currently.
       * A redesign would be needed to address this fully.
       *
       * @override
       * @param options
       */
      async find(options?: {}): Promise<Array<Stamp>> {
        this.items.list.splice(0, this.items.list.length)
        this.items.loading = true
        const data: EntityList<Stamp> = await this.service.find(options)
        data.items.forEach((e) => {
          e = setActiveCatalogueNumber(e)
          this.items.list.push(e)
          this.items.total = data.total
        })
        this.items.loading = false
        return this.items.list
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

      /**
       * @override
       * @param stamp
       */
      postFind(stamp: Stamp): Stamp {
        return setActiveCatalogueNumber(stamp)
      }
    }
  },
  baseModelStore<Stamp>()
)
