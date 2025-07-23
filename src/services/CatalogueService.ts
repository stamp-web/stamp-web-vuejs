import BaseManagedService from '@/services/BasedManagedService'
import type { Catalogue } from '@/models/Catalogue'

class CatalogueService extends BaseManagedService<Catalogue> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'catalogues'
  }
}

export default new CatalogueService()
