import type { PersistedModel } from '@/models/entityModels'
import type { Condition } from '@/models/Condition'

export interface CatalogueNumber extends PersistedModel {
  value: number
  catalogueRef: number
  number: string
  condition: Condition
  active: boolean
  unknown: boolean
  nospace: boolean
}
