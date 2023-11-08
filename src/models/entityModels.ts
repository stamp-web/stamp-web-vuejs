export interface PersistedNamedModel {
  id: number
  name: string
  description?: string
}

export interface Catalogue extends PersistedNamedModel {
  issue: number
  type: number
  code: string
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
