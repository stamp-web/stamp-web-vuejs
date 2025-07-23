import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { Seller } from '@/models/entityModels'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import SellerService from '@/services/SellerService'
import type BaseModelService from '@/services/BaseModelService'

type SellerStoreType = PiniaStore<'sellerStore', {}, {}, {}, BaseNamedModelStore<Seller>>

export const sellerStore = useStore<SellerStoreType, BaseNamedModelStore<Seller>>(
  'sellerStore',
  {
    state: {},
    getters: {
      service(): BaseModelService<Seller> {
        return SellerService
      }
    }
  },
  baseNamedModelStore<Seller>()
)
