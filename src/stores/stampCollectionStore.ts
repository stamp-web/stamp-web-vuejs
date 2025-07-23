import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { StampCollection } from '@/models/entityModels'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import StampCollectionService from '@/services/StampCollectionService'
import BaseModelService from '@/services/BaseModelService'

type StampCollectionStoreType = PiniaStore<
  'stampCollectionStore',
  object,
  object,
  object,
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
      service(): BaseModelService<StampCollection> {
        return StampCollectionService
      }
    },
    actions: {}
  },
  baseNamedModelStore<StampCollection>()
)
