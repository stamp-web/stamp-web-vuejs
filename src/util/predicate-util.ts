import { Operators, Predicate } from 'odata-filter-parser'

export const PredicateUtilities = {
  removeMatchFromArray(subject: string, predicateList: Array<Predicate>) {
    let i = 0
    while (i < predicateList.length) {
      const p = this.removeMatchesByPredicate(subject, predicateList[i])
      if (p) {
        predicateList.splice(i++, 1, p)
      } else {
        predicateList.splice(i, 1)
      }
    }
  },

  removeMatchesByPredicate(subject: string, predicates: Predicate): Predicate | undefined {
    let result: Predicate | undefined = predicates
    if (Operators.isLogical(result.operator)) {
      if (result.subject instanceof Predicate && result.subject.subject === subject) {
        result = result.value
      }
      if (result && result.value instanceof Predicate && result.value.subject === subject) {
        result = result.subject
      }
      if (
        result &&
        result.subject instanceof Predicate &&
        Operators.isLogical(result.subject.operator)
      ) {
        result.subject = PredicateUtilities.removeMatchesByPredicate(
          subject,
          result.subject
        )
        if (!result.subject) {
          result = result.value
        }
      }
      if (result && result.value instanceof Predicate && Operators.isLogical(result.value.operator)) {
        result.value = PredicateUtilities.removeMatchesByPredicate(subject, result.value)
        if (!result.value) {
          result = result.subject
        }
      }
    }
    if (result instanceof Predicate && result.subject === subject) {
      result = undefined
    }
    return result
  },

  concat(op: string, array: Array<unknown>): Predicate | undefined {
    const ret: Array<Predicate | []> = [].concat(
      ...(array.filter((elm): elm is Predicate | [] => {
        return Boolean(elm && (Array.isArray(elm) || elm instanceof Predicate))
      }) as unknown as [])
    )
    if (ret && ret.length > 1) {
      return Predicate.concat(op, ret as unknown as Predicate[])
    } else {
      if (ret && (ret[0] as unknown) instanceof Predicate) {
        return ret[0] as Predicate
      }
    }
    return undefined
  }
}
