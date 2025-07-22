import type { PersistedModel } from '@/models/entityModels.ts'

/**
 * Function decorator to check the input object and verify it has a id value that is > 0.  If this condition
 * is not met it will throw a RangeError exception which will reject as a promise if it is asynchronous
 *
 * @param target - The prototype of the class (or the constructor function for a static method)
 * @param propertyKey - The name of the decorated method
 * @param descriptor - The property descriptor of the decorated method
 *
 * @throws RangeError if the model is not defined, does not have an id or the id is <= 0
 */
export default function requiredId(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value
  descriptor.value = function (this: any, ...args: unknown[]) {
    const obj = args[0] as PersistedModel
    if (!obj || !obj.id || obj.id <= 0) {
      throw new RangeError('A required id is not provided.')
    }
    return originalMethod.apply(this, args)
  }
  return descriptor
}
