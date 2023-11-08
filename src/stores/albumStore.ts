import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type { Album } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseModelStore } from '@/stores/baseModelStore'
import AlbumService from '@/services/AlbumService'

type AlbumStoreType = PiniaStore<'albumStore', {}, {}, {}, BaseModelStore<Album>>

export const albumStore = useStore<AlbumStoreType, BaseModelStore<Album>>(
  'albumStore',
  {
    state: {},
    getters: {
      service(): BaseService<Album> {
        return AlbumService
      }
    }
  },
  baseModelStore<Album>()
)
