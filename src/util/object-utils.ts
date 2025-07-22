import type { KeyIndexable } from '@/util/ts/key-accessor'
import _isObject from 'lodash-es/isObject'
import _isArrayLikeObject from 'lodash-es/isArrayLikeObject'
import _has from 'lodash-es/has'
import _isNumber from 'lodash-es/isNumber'
import _set from 'lodash-es/set'
import { AxiosError } from 'axios'
import LocaleUtils from '@/util/locale-utils'

export function isNil(obj: unknown): boolean {
  return obj === null || obj === undefined
}

/**
 * Return and resolve the path of the object or return the default value
 * https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
 *
 * @param obj
 * @param path
 * @param defaultValue
 */
export function resolvePath(obj: unknown, path: string, defaultValue?: unknown): unknown {
  return (
    path
      .split(/[.[\]'"]/)
      .filter((p) => p)
      // @ts-expect-error: cannot resolve type of o
      .reduce((o, p) => o?.[p] ?? defaultValue, obj)
  )
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
export function augmentModel(model: object, m: object): void {
  Object.keys(m).forEach((k) => {
    const value: unknown = (m as KeyIndexable)[k] as unknown
    const obj = _isObject(value)
    const arr = _isArrayLikeObject(value)
    if (!_has(model, k)) {
      const num = _isNumber(value)
      const v = arr ? [] : obj ? {} : num ? 0 : null
      _set(model, k, v)
    } else if (arr) {
      for (let i = 0; i < value.length; i++) {
        // @ts-expect-error: multiple possible object types
        augmentModel((model as KeyIndexable)[k][i] as object, (value as KeyIndexable)[i] as object)
      }
    }
  })
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

/**
 * Generates a v4 UUID
 *
 * Algorithm obtained from: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
 */
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function extractErrorMessage(err: Error) {
  let message = err.message
  if (err instanceof AxiosError) {
    const msg = err.response?.data
    if (msg) {
      message = msg
    }
  }
  return message
}

export function fixFraction(num: string, digits: number = 2): number {
  const n = parseFloat(num)
  if (Number.isNaN(n)) {
    return 0
  }
  return Math.floor(n * Math.pow(10, digits)) / Math.pow(10, digits)
}

export class EnumHelper {
  public static asEnumArray(type: object, value: number | undefined) {
    if (isNil(value) || value === undefined || value <= 0) {
      return []
    }
    // valued enums contain twice the keys of a value key so we need to divide by 2
    const v = determineShiftedValues(value, Object.keys(type).length / 2)
    const enums: unknown[] = []
    v.forEach((ordinal: number) => {
      // @ts-expect-error: not sure how to resolve this from a linting perspective
      enums.push(type[type[ordinal]])
    })
    return enums
  }

  public static buildEnumListModel(enumeration: object, tokenName: string) {
    const keys = Object.keys(enumeration as object)
    const items = []
    if (keys) {
      const len = keys.length / 2
      for (let i = 0; i < len; i++) {
        items.push({
          value: +keys[i],
          label: LocaleUtils.t(`${tokenName}.${keys[i + len]}`)
        })
      }
    }
    return items
  }

  public static enumToString(enumeration: object, value: unknown): string | undefined {
    // @ts-expect-error: unclear type for enumeration
    for (const k in enumeration) if (enumeration[k] == value) return <string>k
    return undefined
  }
}
