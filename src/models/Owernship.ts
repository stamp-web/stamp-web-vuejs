import type { PersistedModel } from '@/models/entityModels'
import type { Grade } from '@/models/Grade'
import type { CurrencyCode } from '@/models/CurrencyCode'
import type { Condition } from '@/models/Condition'

export interface Ownership extends PersistedModel {
  pricePaid: number
  purchased?: Date
  grade: Grade
  condition: Condition
  img?: string
  notes?: string
  code: CurrencyCode
  defects: number
  deception: number
  cert: boolean
  certImg?: string
  albumRef: number
  sellerRef: number
}
