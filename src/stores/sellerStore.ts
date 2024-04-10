import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type { Seller } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseModelStore } from '@/stores/baseModelStore'
import SellerService from '@/services/SellerService'
import { CountModel } from '@/models/countModel'
import BaseManagedService from '@/services/BasedManagedService'

type SellerStoreType = PiniaStore<
  'sellerStore',
  {},
  {},
  {
    getStampCount(): Promise<CountModel[]>
  },
  BaseModelStore<Seller>
>

export const sellerStore = useStore<SellerStoreType, BaseModelStore<Seller>>(
  'sellerStore',
  {
    state: {},
    getters: {
      service(): BaseService<Seller> {
        return SellerService
      }
    },
    actions: {
      async getStampCount(): Promise<CountModel[]> {
        const counts = await (this.service as BaseManagedService<Seller>).getStampCount()
        counts.forEach((cm) => {
          const seller = this.items.list.find((c) => c.id === cm.id)
          if (seller) {
            seller.count = cm.count
          }
        })
        return counts
      }
    }
  },
  baseModelStore<Seller>()
)
