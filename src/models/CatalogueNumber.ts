import type { PersistedModel } from '@/models/entityModels'
import type { Condition } from '@/models/Condition'
import type { Preference } from '@/models/Preference'
import { createInstance } from '@/models/entityModels'

export type CatalogueNumber = PersistedModel & {
  value: number
  catalogueRef: number
  number: string
  condition: Condition
  active: boolean
  unknown: boolean
  nospace: boolean
}

export class CatalogueNumberHelper {
  static newInstance(preferences?: Array<Preference>): CatalogueNumber {
    const catalogueNumber = createInstance<CatalogueNumber>({
      id: 0,
      active: true
    })

    if (preferences && preferences.length > 0) {
      const prefKeys = ['catalogueRef', 'condition']
      prefKeys.forEach((key) => {
        const pref = preferences.find((p) => key === p.name)
        if (pref) {
          // @ts-ignore
          catalogueNumber[key] = +pref.value
        }
      })
    }
    return catalogueNumber
  }
}
