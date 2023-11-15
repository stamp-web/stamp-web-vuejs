import type { PersistedModel } from '@/models/entityModels'

export interface Preference extends PersistedModel {
  name: string
  category: string
  value?: string
}
