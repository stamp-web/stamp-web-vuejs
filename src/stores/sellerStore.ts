import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseNamedModelStore } from '@/stores/baseNamedModelStore'
import type { Seller } from '@/models/entityModels'
import { baseNamedModelStore } from '@/stores/baseNamedModelStore'
import SellerService from '@/services/SellerService'
import BaseModelService from '@/services/BaseModelService'

type SellerStoreType = PiniaStore<
  'sellerStore',
  object,
  object,
  object,
  BaseNamedModelStore<Seller>
>

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
