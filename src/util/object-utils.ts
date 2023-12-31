import type { KeyIndexable } from '@/util/ts/key-accessor'
import _isObject from 'lodash-es/isObject'
import _isArrayLikeObject from 'lodash-es/isArrayLikeObject'
import _has from 'lodash-es/has'
import _isNumber from 'lodash-es/isNumber'
import _set from 'lodash-es/set'
import { CurrencyCode } from '@/models/CurrencyCode'

export function isNil(obj: any): boolean {
  return obj === null || obj === undefined
}

/**
 * Return and resolve the path of the object or return the default value
 * https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
 *
 * @param object
 * @param path
 * @param defaultValue
 */
export function resolvePath(object: any, path: string, defaultValue?: any): any {
  return path
    .split(/[.[\]'"]/)
    .filter((p) => p)
    .reduce((o, p) => o?.[p] ?? defaultValue, object)
}
/**
 * Augment the model by defining any missing keys as null, unless they are objects in which case an empty object
 * will be created.  This is for pre-merge processing.  Service values will return from the Database without being defined.
 * If this value previously existed before the update the model that it is being merged too will have a key and the new
 * model will not, skipping the clearing of that field.  This occurs for dates, but could show up for other values.
 *
 * @param model
 * @param m
 */
export function augmentModel(model: Object, m: Object): void {
  Object.keys(m).forEach((k) => {
    const value: any = (m as KeyIndexable)[k]
    const obj = _isObject(value)
    const arr = _isArrayLikeObject(value)
    if (!_has(model, k)) {
      const num = _isNumber(value)
      const v = arr ? [] : obj ? {} : num ? 0 : null
      _set(model, k, v)
    } else if (arr) {
      for (let i = 0; i < value.length; i++) {
        augmentModel(
          (model as KeyIndexable)[k][i] as Object,
          (value as KeyIndexable)[i] as Object
        )
      }
    }
  })
}

export function asCurrencyString(value: number, currency: string): string {
  const minFractions = currency === CurrencyCode.JPY ? 0 : 2
  let text = ''
  if (currency) {
    text = value.toLocaleString('en', {
      style: 'currency',
      currencyDisplay: 'symbol',
      currency: currency,
      minimumFractionDigits: minFractions
    })
  }
  return text
}

export function determineShiftedValues(total: number, highestCount: number) {
  const values = []
  let runningTotal = total
  for (let i = highestCount; i >= 0; i--) {
    if (runningTotal >> i === 1) {
      const binValue = Math.pow(2, i)
      runningTotal = runningTotal - binValue
      values.push(binValue)
    }
  }
  return values
}

export class EnumHelper {
  public static asEnumArray(type: any, value: number) {
    if (value <= 0 || isNil(value)) {
      return []
    }
    // valued enums contain twice the keys of a value key so we need to divide by 2
    const v = determineShiftedValues(value, Object.keys(type).length / 2)
    const enums: any[] = []
    v.forEach((ordinal: number) => {
      enums.push(type[type[ordinal]])
    })
    return enums
  }
}
