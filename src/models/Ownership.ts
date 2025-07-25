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
import { asLocalDate } from '@/util/date-utils'

export type Ownership = PersistedModel & {
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
      ownership.purchased = asLocalDate(purchased)
    }
    if (preferences && preferences.length > 0) {
      const intPrefKeys = ['albumRef', 'sellerRef', 'condition', 'grade']
      const strPrefKeys: string[] = ['code']
      intPrefKeys.concat(strPrefKeys).forEach((key) => {
        const pref = preferences.find((p) => key === p.name)
        if (pref) {
          const value = intPrefKeys.includes(key) && pref.value ? +pref.value : pref.value
          switch (key) {
            case 'albumRef':
              ownership.albumRef = value as number
              break
            case 'sellerRef':
              ownership.sellerRef = value as number
              break
            case 'condition':
              ownership.condition = value as Condition
              break
            case 'grade':
              ownership.grade = value as Grade
              break
            case 'code':
              ownership.code = value as CurrencyCode
              break
          }
        }
      })
    }
    return ownership
  }

  static toTagElementView(model: Ownership) {
    // @ts-expect-error - _defects is a runtime field from the form (bug #64)
    model['_defects'] = EnumHelper.asEnumArray(Defects, model.defects)
    // @ts-expect-error - _deception is a runtime field from the form (bug #64)
    model['_deception'] = EnumHelper.asEnumArray(Deception, model.deception)
  }

  static fromTagElementView(model: Record<string, unknown>) {
    const fieldNames = ['defects', 'deception']
    fieldNames.forEach((name) => {
      let total = 0
      if (model[`_${name}`]) {
        ;(model[`_${name}`] as number[]).forEach((v: number) => {
          total += v
        })
        model[name] = total
        delete model[`_${name}`]
      }
    })
  }
}
