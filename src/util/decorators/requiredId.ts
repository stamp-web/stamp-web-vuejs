/**
 * Function decorator to check the input object and verify it has a id value that is > 0.  If this condition
 * is not met it will throw a RangeError exception which will reject as a promise if it is asynchronous
 *
 * @param target
 * @param name
 * @param descriptor
 *
 * @throws RangeError if the model is not defined, does not have an id or the id is <= 0
 */
export default function requiredId(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    const obj = args[0]
    if (!obj || !obj.id || obj.id <= 0) {
      throw new RangeError('A required id is not provided.')
    }
    const result = originalMethod.apply(this, args)
    return result
  }
  return descriptor
}
