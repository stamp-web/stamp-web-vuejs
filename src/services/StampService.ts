import type { Stamp } from '@/models/Stamp'
import BaseModelService from '@/services/BaseModelService'
class StampService extends BaseModelService<Stamp> {
  constructor() {
    super()
  }

  getResourceName(): string {
    return 'stamps'
  }
}

export default new StampService()
