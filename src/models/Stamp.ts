import type { Ownership } from '@/models/Owernship'
import type { CatalogueNumber } from '@/models/CatalogueNumber'
import type { PersistedModel } from '@/models/entityModels'

export interface Stamp extends PersistedModel {
  description?: string
  rate?: string
  printing: number
  wantlist: boolean
  countryRef: number
  stampOwnerships: Array<Ownership>
  catalogueNumbers: Array<CatalogueNumber>
  activeCatalogueNumber?: CatalogueNumber
}
