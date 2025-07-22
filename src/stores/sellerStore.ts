import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { Album, Seller } from '@/models/entityModels'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import SellerService from '@/services/SellerService'
import BaseModelService from '@/services/BaseModelService'

const storeId = 'sellerStore' as const

type SellerStoreType = PiniaStore<
  typeof storeId,
  object,
  object,
  object,
  BaseNamedModelStore<Seller, typeof storeId>
>

export const sellerStore = useStore<SellerStoreType, BaseNamedModelStore<Seller, typeof storeId>>(
  storeId,
  {
    state: {},
    getters: {
      service(): BaseModelService<Seller> {
        return SellerService
      },
      baseSearchOptions(): object {
        return { $orderby: 'name asc' }
      }
    }
  },
  baseNamedModelStore<Seller, typeof storeId>()
)
