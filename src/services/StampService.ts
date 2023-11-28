import BaseService from '@/services/BaseService'
import type { Stamp } from '@/models/Stamp'
class StampService extends BaseService<Stamp> {
  constructor() {
    super()
  }

  getResourceName(): string {
    return 'stamps'
  }
}

export default new StampService()
