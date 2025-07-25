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
  private static readonly preferenceMapping: Record<
    string,
    {
      type: 'number' | 'string'
      field: keyof Ownership
    }
  > = {
    albumRef: { type: 'number', field: 'albumRef' },
    sellerRef: { type: 'number', field: 'sellerRef' },
    condition: { type: 'number', field: 'condition' },
    grade: { type: 'number', field: 'grade' },
    code: { type: 'string', field: 'code' }
  }

  private static applyPreference(
    ownership: Ownership,
    pref: Preference,
    mapping: (typeof OwnershipHelper.preferenceMapping)[string]
  ): void {
    if (!pref.value) return

    const value = mapping.type === 'number' ? +pref.value : pref.value
    // TypeScript will ensure type safety here since we're using keyof Ownership
    ownership[mapping.field] = value as never
  }

  static newInstance(preferences?: Preference[]): Ownership {
    const ownership = createInstance<Ownership>({ id: 0 })
    const purchased = LocalCache.getItem('ownership-purchased')
    if (purchased) {
      // We need to offset the plain date string to account for UTC offset
      ownership.purchased = asLocalDate(purchased)
    }
    if (preferences?.length) {
      Object.entries(this.preferenceMapping).forEach(([prefName, mapping]) => {
        const pref = preferences.find((p) => p.name === prefName)
        if (pref) {
          this.applyPreference(ownership, pref, mapping)
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
