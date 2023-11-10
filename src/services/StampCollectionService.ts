import type { StampCollection } from '../models/entityModels'
import BaseService from '@/services/BaseService'

class StampCollectionService extends BaseService<StampCollection> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'stampCollections'
  }
}

export default new StampCollectionService()
