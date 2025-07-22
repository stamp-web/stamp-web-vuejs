export interface PersistedModel {
  id: number
}
export interface PersistedNamedModel extends PersistedModel {
  id: number
  name: string
  description?: string
  count?: number
}

export interface Country extends PersistedNamedModel {
  id: number
}

export interface Album extends PersistedNamedModel {
  id: number
  stampCollectionRef: number
}
export interface StampCollection extends PersistedNamedModel {
  id: number
}

export interface Seller extends PersistedNamedModel {
  id: number
  stampCollectionRef: number
}

export function createInstance<T>(data: object) {
  const c = data
  return <T>c
}
