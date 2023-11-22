import type { Country } from '@/models/entityModels'
import BaseManagedService from '@/services/BasedManagedService'
class CountryService extends BaseManagedService<Country> {
  constructor() {
    super()
  }

  getResourceName(): string {
    return 'countries'
  }
}

export default new CountryService()
