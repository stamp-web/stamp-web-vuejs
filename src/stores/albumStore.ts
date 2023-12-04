import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type { Album } from '@/models/entityModels'
import { baseModelStore } from '@/stores/baseModelStore'
import AlbumService from '@/services/AlbumService'
import type BaseManagedService from '@/services/BasedManagedService'
import { CountModel } from '@/models/countModel'

type AlbumStoreType = PiniaStore<
  'albumStore',
  {},
  {},
  {
    getStampCount(): Promise<CountModel[]>
  },
  BaseModelStore<Album>
>

export const albumStore = useStore<AlbumStoreType, BaseModelStore<Album>>(
  'albumStore',
  {
    state: {},
    getters: {
      service(): BaseManagedService<Album> {
        return AlbumService
      }
    },
    actions: {
      async getStampCount(): Promise<CountModel[]> {
        const counts = await (this.service as BaseManagedService<Album>).getStampCount()
        counts.forEach((cm) => {
          const album = this.items.list.find((a) => a.id === cm.id)
          if (album) {
            album.count = cm.count
          }
        })
        return counts
      }
    }
  },
  baseModelStore<Album>()
)
