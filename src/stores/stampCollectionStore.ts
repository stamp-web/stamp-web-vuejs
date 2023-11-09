import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type {StampCollection} from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseModelStore } from '@/stores/baseModelStore'
import StampCollectionService from '@/services/StampCollectionService'

type StampCollectionStoreType = PiniaStore<'stampCollectionStore', {}, {}, {}, BaseModelStore<StampCollection>>

export const stampCollectionStore = useStore<StampCollectionStoreType, BaseModelStore<StampCollection>>(
  'stampCollectionStore',
  {
    state: {},
    getters: {
      service(): BaseService<StampCollection> {
        return StampCollectionService
      }
    }
  },
  baseModelStore<StampCollection>()
)
