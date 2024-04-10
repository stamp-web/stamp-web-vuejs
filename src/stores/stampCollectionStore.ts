import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { StampCollection } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import StampCollectionService from '@/services/StampCollectionService'

type StampCollectionStoreType = PiniaStore<
  'stampCollectionStore',
  {},
  {},
  {},
  BaseNamedModelStore<StampCollection>
>

export const stampCollectionStore = useStore<
  StampCollectionStoreType,
  BaseNamedModelStore<StampCollection>
>(
  'stampCollectionStore',
  {
    state: {},
    getters: {
      service(): BaseService<StampCollection> {
        return StampCollectionService
      }
    },
    actions: {}
  },
  baseNamedModelStore<StampCollection>()
)
