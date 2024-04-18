import type { PersistedModel } from '@/models/entityModels'
import type { Grade } from '@/models/Grade'
import type { CurrencyCode } from '@/models/CurrencyCode'
import type { Condition } from '@/models/Condition'
import { type Preference } from '@/models/Preference'
import { createInstance } from '@/models/entityModels'

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

export class OwnershipHelper {
  static newInstance(preferences?: Array<Preference>): Ownership {
    const ownership = createInstance<Ownership>({ id: 0 })
    if (preferences && preferences.length > 0) {
      const prefKeys = ['albumRef', 'sellerRef', 'condition', 'grade', 'code']
      prefKeys.forEach((key) => {
        const pref = preferences.find((p) => key === p.name)
        if (pref) {
          // @ts-ignore
          ownership[key] = pref.value
        }
      })
    }
    return ownership
  }
}
