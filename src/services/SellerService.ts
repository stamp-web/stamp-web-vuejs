import type { Seller } from '@/models/entityModels'
import BaseManagedService from '@/services/BasedManagedService'
class SellerService extends BaseManagedService<Seller> {
  constructor() {
    super()
  }

  getResourceName(): string {
    return 'sellers'
  }
}

export default new SellerService()
