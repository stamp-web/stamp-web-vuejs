import type { Stamp } from '@/models/Stamp'
import StampService from '@/services/StampService'
import BaseService from '@/services/BaseService'
import type { CatalogueNumber } from '@/models/CatalogueNumber'
import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import { baseModelStore } from '@/stores/baseModelStore'

type StampStoreType = PiniaStore<'stampStore', {}, {}, {}, BaseModelStore<Stamp>>

export const stampStore = useStore<StampStoreType, BaseModelStore<Stamp>>(
  'stampStore',
  {
    state: {},
    getters: {
      service(): BaseService<Stamp> {
        return StampService
      }
    },
    actions: {
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
