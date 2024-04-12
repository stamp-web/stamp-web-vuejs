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
      /**
       * @override
       * @param stamp
       */
      postFind(stamp: Stamp): Stamp {
        const activeCN = stamp.catalogueNumbers.find((cn: CatalogueNumber) => {
          return cn.active
        })
        stamp.activeCatalogueNumber = activeCN
        return stamp
      }
    }
  },
  baseModelStore<Stamp>()
)
