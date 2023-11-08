import type { Country } from '../models/entityModels'
import BaseService from '../services/BaseService'
class CountryService extends BaseService<Country> {
  constructor() {
    super()
  }

  getResourceName(): string {
    return 'countries'
  }
}

export default new CountryService()
