/**
 * Type represents a record in select dropdowns for non-model rows where the value
 * may be different depending on the selection type.
 */
export type ValueRecord<T> = {
  value: T
  name: string
}
