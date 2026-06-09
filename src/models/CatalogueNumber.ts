import type { PersistedModel } from '@/models/entityModels'
import { createInstance } from '@/models/entityModels'
import type { Condition } from '@/models/Condition'
import type { Preference } from '@/models/Preference'

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
  static newInstance(preferences?: Preference[]): CatalogueNumber {
    const catalogueNumber = createInstance<CatalogueNumber>({
      id: 0,
      active: true,
      nospace: false,
      unknown: false
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
