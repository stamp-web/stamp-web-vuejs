import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'

import type { Album } from '@/models/entityModels'
import AlbumService from '@/services/AlbumService'
import type BaseManagedService from '@/services/BasedManagedService'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'

const storeId = 'albumStore' as const

type AlbumStoreType = PiniaStore<
  typeof storeId,
  object,
  object,
  object,
  BaseNamedModelStore<Album, typeof storeId>
>

export const albumStore = useStore<AlbumStoreType, BaseNamedModelStore<Album, typeof storeId>>(
  storeId,
  {
    state: {},
    getters: {
      service(): BaseManagedService<Album> {
        return AlbumService
      },
      baseSearchOptions(): object {
        return { $orderby: 'name asc' }
      }
    },
    actions: {}
  },
  baseNamedModelStore<Album, typeof storeId>()
)
