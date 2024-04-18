import type { CatalogueNumber } from '@/models/CatalogueNumber'
import type { PersistedModel } from '@/models/entityModels'
import { createInstance } from '@/models/entityModels'
import type { Preference } from '@/models/Preference'
import { CatalogueNumberHelper } from '@/models/CatalogueNumber'
import { OwnershipHelper, type Ownership } from '@/models/Ownership'

export interface Stamp extends PersistedModel {
  description?: string
  rate?: string
  printing: number
  wantList: boolean
  countryRef: number
  stampOwnerships: Array<Ownership>
  catalogueNumbers: Array<CatalogueNumber>
  activeCatalogueNumber?: CatalogueNumber
}

export class StampModelHelper {
  static newInstance = (wantList = false, preferences?: Array<Preference>): Stamp => {
    const catalogueNumber = CatalogueNumberHelper.newInstance(preferences)

    const stamp = createInstance<Stamp>({
      id: 0,
      wantList: wantList,
      activeCatalogueNumber: catalogueNumber,
      catalogueNumbers: [catalogueNumber],
      stampOwnerships: []
    })
    if (!wantList) {
      stamp.stampOwnerships.push(OwnershipHelper.newInstance(preferences))
    }

    if (preferences && preferences.length > 0) {
      const pref = preferences.find((p) => 'countryRef' === p.name)
      if (pref) {
        // @ts-ignore
        stamp.countryRef = pref.value
      }
    }

    console.log('generated stamp', stamp)
    return stamp
  }
}
