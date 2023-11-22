import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type { Album } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseModelStore } from '@/stores/baseModelStore'
import AlbumService from '@/services/AlbumService'
import type BaseManagedService from '@/services/BasedManagedService'

type AlbumStoreType = PiniaStore<'albumStore', {}, {}, {}, BaseModelStore<Album>>

export const albumStore = useStore<AlbumStoreType, BaseModelStore<Album>>(
  'albumStore',
  {
    state: {},
    getters: {
      service(): BaseManagedService<Album> {
        return AlbumService
      }
    }
  },
  baseModelStore<Album>()
)
