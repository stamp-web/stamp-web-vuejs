import { preferenceStore } from '@/stores/PreferenceStore'
import { countryStore } from '@/stores/countryStore'
import { catalogueStore } from '@/stores/catalogueStore'
import { stampStore } from '@/stores/stampStore'
import { type Stamp, StampModelHelper } from '@/models/Stamp'
import { CatalogueModelHelper } from '@/models/Catalogue'

export class StampModelUtils {
  countriesStore = countryStore()
  cataloguesStore = catalogueStore()
  store = stampStore()
  prefStore = preferenceStore()

  bulkEditStamps = (
    selectedStamps: Stamp[],
    values: Record<string, unknown>
  ): Array<Promise<Stamp>> => {
    return selectedStamps.map(async (s: Stamp) => {
      this.assignProperties(s, values)
      const imageUpdate = values['updateImagePath']
      if (imageUpdate) {
        const cn = s.activeCatalogueNumber
        const country = await this.countriesStore.findById(s.countryRef)
        if (!s.wantList && cn && country) {
          const catalogue = await this.cataloguesStore.findById(cn.catalogueRef)
          const prefix = CatalogueModelHelper.getPrefix(catalogue)
          const path = StampModelHelper.calculateImagePath(s, cn, country.name, prefix, true, true)
          s.stampOwnerships[0].img = path
        }
      }
      return this.store.update(s)
    })
  }

  assignProperties = (stamp: Stamp, properties: Record<string, unknown>) => {
    for (const prop in properties) {
      switch (prop) {
        case 'countryRef':
          stamp.countryRef = properties[prop]
          break
        case 'albumRef':
        case 'sellerRef':
          if (stamp.stampOwnerships && stamp.stampOwnerships.length > 0) {
            stamp.stampOwnerships[0][prop] = properties[prop]
          }
          break
        case 'catalogueRef':
          if (stamp.activeCatalogueNumber) {
            stamp.activeCatalogueNumber.catalogueRef = properties[prop]
          }
          break
      }
    }
  }
}
