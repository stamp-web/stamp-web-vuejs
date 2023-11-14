import type { KeyIndexable } from '@/util/ts/key-accessor'
import { isObject } from 'lodash-es'
import { isArrayLikeObject } from 'lodash-es'
import { has } from 'lodash-es'
import { isNumber } from 'lodash-es'
import _set from 'lodash-es/set'

export function isNil(obj: any) {
  return obj === null || obj === undefined
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
export function augmentModel(model: Object, m: Object) {
  Object.keys(m).forEach((k) => {
    const value: any = (m as KeyIndexable)[k]
    const obj = isObject(value)
    const arr = isArrayLikeObject(value)
    if (!has(model, k)) {
      const num = isNumber(value)
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
