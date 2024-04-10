import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { Album } from '@/models/entityModels'
import AlbumService from '@/services/AlbumService'
import type BaseManagedService from '@/services/BasedManagedService'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'

type AlbumStoreType = PiniaStore<'albumStore', {}, {}, {}, BaseNamedModelStore<Album>>

export const albumStore = useStore<AlbumStoreType, BaseNamedModelStore<Album>>(
  'albumStore',
  {
    state: {},
    getters: {
      service(): BaseManagedService<Album> {
        return AlbumService
      }
    },
    actions: {}
  },
  baseNamedModelStore<Album>()
)
