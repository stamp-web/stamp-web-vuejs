import BaseService from '@/services/BaseService'
import type { Preference } from '@/models/Preference'

class PreferenceService extends BaseService<Preference> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'preferences'
  }
}

export default new PreferenceService()
