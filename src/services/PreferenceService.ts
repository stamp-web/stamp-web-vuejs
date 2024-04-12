import type { Preference } from '@/models/Preference'
import BaseModelService from '@/services/BaseModelService'

class PreferenceService extends BaseModelService<Preference> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'preferences'
  }
}

export default new PreferenceService()
