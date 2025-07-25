import type { CatalogueNumber } from '@/models/CatalogueNumber'
import { type PersistedModel } from '@/models/entityModels'
import { createInstance } from '@/models/entityModels'
import type { Preference } from '@/models/Preference'
import { CatalogueNumberHelper } from '@/models/CatalogueNumber'
import { OwnershipHelper, type Ownership } from '@/models/Ownership'
import { ConditionHelper } from '@/models/Condition'

export type Stamp = PersistedModel & {
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
        stamp.countryRef = +pref.value
      }
    }
    return stamp
  }

  static calculateImagePath = (
    stamp: Stamp,
    catalogueNumber: CatalogueNumber,
    countryName: string,
    prefix: string = '',
    includeUsedInPath: boolean = true,
    preserveFilename: boolean = false
  ) => {
    let path = ''
    if (!stamp.wantList) {
      if (countryName && catalogueNumber && countryName !== '' && catalogueNumber.number) {
        path = `${countryName}/`
        if (includeUsedInPath && ConditionHelper.isUsed(catalogueNumber.condition)) {
          path += 'used/'
        } else if (includeUsedInPath && ConditionHelper.isOnCover(catalogueNumber.condition)) {
          path += 'on-cover/'
        }
        if (preserveFilename) {
          const img = stamp.stampOwnerships[0].img
          if (img) {
            path += img.substring(img.lastIndexOf('/') + 1)
          }
        } else {
          if (prefix) {
            path += prefix
          }
          path += `${catalogueNumber.number.replace('/', '_')}.jpg`
          path = path.replace(/[[<>'";`%{}\]]/gi, '-')
        }
      }
    }

    return path
  }
}
