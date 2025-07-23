export interface PersistedModel {
  id: number
}
export interface PersistedNamedModel extends PersistedModel {
  name: string
  description?: string
  count?: number
}

export type Country = PersistedNamedModel

export interface Album extends PersistedNamedModel {
  stampCollectionRef: number
}
export type StampCollection = PersistedNamedModel

export interface Seller extends PersistedNamedModel {
  stampCollectionRef: number
}

export function createInstance<T>(data: object) {
  const c = data
  return <T>c
}
