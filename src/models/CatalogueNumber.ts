import type { PersistedModel } from '@/models/entityModels'
import type { Condition } from '@/models/Condition'
import type { Preference } from '@/models/Preference'
import { createInstance } from '@/models/entityModels'

export type CatalogueNumber = PersistedModel & {
  value: number
  catalogueRef: number
  number: string
  condition: Condition
  active: { type: boolean; default: true }
  unknown: { type: boolean; default: false }
  nospace: { type: boolean; default: false }
}

export class CatalogueNumberHelper {
  static newInstance(preferences?: Preference[]): CatalogueNumber {
    const catalogueNumber = createInstance<CatalogueNumber>({
      id: 0,
      active: true
    })

    type NumericKeys = keyof Pick<CatalogueNumber, 'catalogueRef' | 'condition'>
    const prefKeys: NumericKeys[] = ['catalogueRef', 'condition']

    if (preferences && preferences?.length > 0) {
      prefKeys.forEach((key) => {
        const pref = preferences.find((p) => p.name === key)
        if (pref?.value) {
          catalogueNumber[key] = +pref.value as CatalogueNumber[NumericKeys]
        }
      })
    }

    return catalogueNumber
  }
}
