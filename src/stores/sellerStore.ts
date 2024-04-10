import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { Seller } from '@/models/entityModels'
import type BaseService from '@/services/BaseService'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import SellerService from '@/services/SellerService'

type SellerStoreType = PiniaStore<'sellerStore', {}, {}, {}, BaseNamedModelStore<Seller>>

export const sellerStore = useStore<SellerStoreType, BaseNamedModelStore<Seller>>(
  'sellerStore',
  {
    state: {},
    getters: {
      service(): BaseService<Seller> {
        return SellerService
      }
    }
  },
  baseNamedModelStore<Seller>()
)
