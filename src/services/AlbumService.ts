import type { Album } from '../models/entityModels'
import BaseService from '@/services/BaseService'

class AlbumService extends BaseService<Album> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'albums'
  }
}

export default new AlbumService()
