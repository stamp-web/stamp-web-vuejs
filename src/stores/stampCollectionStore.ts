import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type { StampCollection } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseModelStore } from '@/stores/baseModelStore'
import StampCollectionService from '@/services/StampCollectionService'
import { CountModel } from '@/models/countModel'
import BaseManagedService from '@/services/BasedManagedService'

type StampCollectionStoreType = PiniaStore<
  'stampCollectionStore',
  {},
  {},
  { getStampCount(): Promise<CountModel[]> },
  BaseModelStore<StampCollection>
>

export const stampCollectionStore = useStore<
  StampCollectionStoreType,
  BaseModelStore<StampCollection>
>(
  'stampCollectionStore',
  {
    state: {},
    getters: {
      service(): BaseService<StampCollection> {
        return StampCollectionService
      }
    },
    actions: {
      async getStampCount(): Promise<CountModel[]> {
        const counts = await (
          this.service as BaseManagedService<StampCollection>
        ).getStampCount()
        counts.forEach((cm) => {
          const collection = this.items.list.find((sc) => sc.id === cm.id)
          if (collection) {
            collection.count = cm.count
          }
        })
        return counts
      }
    }
  },
  baseModelStore<StampCollection>()
)
