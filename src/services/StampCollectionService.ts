import type { StampCollection } from '@/models/entityModels'
import BaseManagedService from '@/services/BasedManagedService'

class StampCollectionService extends BaseManagedService<StampCollection> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'stampCollections'
  }
}

export default new StampCollectionService()
