import type { PersistedModel } from '@/models/entityModels'
import type { Grade } from '@/models/Grade'
import type { CurrencyCode } from '@/models/CurrencyCode'
import type { Condition } from '@/models/Condition'
import { type Preference } from '@/models/Preference'
import { createInstance } from '@/models/entityModels'
import LocalCache from '@/stores/LocalCache'
import { EnumHelper } from '@/util/object-utils'
import { Defects } from '@/models/Defects'
import { Deception } from '@/models/Deception'

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
    const purchased = LocalCache.getItem('ownership-purchased')
    if (purchased) {
      // We need to offset the plain date string to account for UTC offset
      ownership.purchased = new Date(new Date(purchased).toUTCString())
    }
    if (preferences && preferences.length > 0) {
      const intPrefKeys = ['albumRef', 'sellerRef', 'condition', 'grade']
      const strPrefKeys: string[] = ['code']
      intPrefKeys.concat(strPrefKeys).forEach((key) => {
        const pref = preferences.find((p) => key === p.name)
        if (pref) {
          // @ts-ignore
          ownership[key] = intPrefKeys.includes(key) ? +pref.value : pref.value
        }
      })
    }
    return ownership
  }

  static toTagElementView(model: Ownership) {
    // @ts-ignore
    model['_defects'] = EnumHelper.asEnumArray(Defects, model.defects)
    // @ts-ignore
    model['_deception'] = EnumHelper.asEnumArray(Deception, model.deception)
  }

  static fromTagElementView(model: any) {
    const fieldNames = ['defects', 'deception']
    fieldNames.forEach((name) => {
      let total = 0
      if (model[`_${name}`]) {
        model[`_${name}`].forEach((v: number) => {
          total += v
        })
        model[name] = total
        delete model[`_${name}`]
      }
    })
  }
}
