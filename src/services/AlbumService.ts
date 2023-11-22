import type { Album } from '@/models/entityModels'
import BaseManagedService from '@/services/BasedManagedService'

class AlbumService extends BaseManagedService<Album> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'albums'
  }
}

export default new AlbumService()
