import type { CurrencyCode } from '@/models/CurrencyCode'

export interface PersistedModel {
  id: number
}
export interface PersistedNamedModel extends PersistedModel {
  name: string
  description?: string
  count?: number
}

export interface Catalogue extends PersistedNamedModel {
  issue: number
  type: number
  code: CurrencyCode
}

export interface Country extends PersistedNamedModel {}

export interface Album extends PersistedNamedModel {
  stampCollectionRef: number
}
export interface StampCollection extends PersistedNamedModel {}

export interface Seller extends PersistedNamedModel {
  stampCollectionRef: number
}

export function createInstance<T>(data: Object) {
  const c = data
  return <T>c
}
