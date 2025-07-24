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

  removeMatchesByPredicate(subject: string, predicates: Predicate) {
    if (Operators.isLogical(predicates.operator)) {
      if (predicates.subject instanceof Predicate && predicates.subject.subject === subject) {
        predicates = predicates.value
      }
      if (predicates.value instanceof Predicate && predicates.value.subject === subject) {
        predicates = predicates.subject
      }
      if (
        predicates.subject instanceof Predicate &&
        Operators.isLogical(predicates.subject.operator)
      ) {
        predicates.subject = PredicateUtilities.removeMatchesByPredicate(
          subject,
          predicates.subject
        )
        if (!predicates.subject || predicates.subject === '') {
          predicates = predicates.value
        }
      }
      if (predicates.value instanceof Predicate && Operators.isLogical(predicates.value.operator)) {
        predicates.value = PredicateUtilities.removeMatchesByPredicate(subject, predicates.value)
        if (!predicates.value || predicates.value === '') {
          predicates = predicates.subject
        }
      }
    }
    if (predicates instanceof Predicate && predicates.subject === subject) {
      predicates = undefined
    }
    return predicates
  },

  concat(op: Operators, array: Array<Predicate | []>) {
    const ret = [].concat(
      ...array.filter((elm: Predicate | []) => {
        return elm && (Array.isArray(elm) || elm instanceof Predicate)
      })
    )
    if (ret && ret.length > 1) {
      return Predicate.concat(op, ret)
    } else {
      if (ret && (ret[0] as unknown) instanceof Predicate) {
        return ret[0]
      }
    }
    return undefined
  }
}
