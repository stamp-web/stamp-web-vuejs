export type PersistedModel = {
  id: number
}
export type PersistedNamedModel = PersistedModel & {
  name: string
  description?: string
  count?: number
}

export type Country = PersistedNamedModel

export type Album = PersistedNamedModel & {
  stampCollectionRef: number
}
export type StampCollection = PersistedNamedModel

export type Seller = PersistedNamedModel & {
  stampCollectionRef: number
}

export function createInstance<T>(data: Record<string, unknown>) {
  return (<T>data) as T
}
