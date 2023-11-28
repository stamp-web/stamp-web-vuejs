import type { Ownership } from '@/models/Owernship'
import type { CatalogueNumber } from '@/models/CatalogueNumber'

export interface Stamp {
  id: number
  description?: string
  rate?: string
  printing: number
  wantlist: boolean
  countryRef: number
  stampOwnerships: Array<Ownership>
  catalogueNumbers: Array<CatalogueNumber>
  activeCatalogueNumber?: CatalogueNumber
}
