import { Operators, Parser, Predicate } from 'odata-filter-parser'
import { PredicateUtilities } from '@/util/predicate-util'
import { type Condition, ConditionHelper } from '@/models/Condition'
import type { LocationQuery } from 'vue-router'
const stampFilters = () => {
  const pushCondition = (conditions: Array<Predicate>, list: Array<Condition>) => {
    list.forEach((c) => {
      conditions.push(
        new Predicate({
          subject: 'condition',
          operator: Operators.EQUALS,
          value: c
        })
      )
    })
  }

  /**
   * Will manage the condition filters in the predicate list
   *
   * @param predicates - current list of predicates.  This list will be mutated
   * @param conditionFilter
   */
  const conditionChanged = (predicates: Array<Predicate>, conditionFilter: string) => {
    PredicateUtilities.removeMatchFromArray('condition', predicates)
    const conditions: Predicate[] = []

    switch (conditionFilter) {
      case 'Used':
        pushCondition(conditions, ConditionHelper.AllUsed())
        break
      case 'Mint':
        pushCondition(conditions, ConditionHelper.AllMint())
        break
      case 'Postal':
        pushCondition(conditions, ConditionHelper.AllPostalHistory())
        break
    }
    if (conditions.length > 0) {
      predicates.push(PredicateUtilities.concat(Operators.OR, conditions))
    }
  }

  /**
   * Modifies the wantList filter on a change.
   *
   * @param predicates - current list of predicates.  This list will be mutated
   * @param wantList - the wantList selection
   */
  const wantListChanged = (predicates: Array<Predicate>, wantList: string) => {
    PredicateUtilities.removeMatchFromArray('wantList', predicates)
    switch (wantList) {
      case 'Owned':
        predicates.push(
          new Predicate({
            subject: 'wantList',
            operator: Operators.EQUALS,
            value: 0
          })
        )
        break
      case 'WantList':
        predicates.push(
          new Predicate({
            subject: 'wantList',
            operator: Operators.EQUALS,
            value: 1
          })
        )
        break
    }
  }

  /**
   *
   * @param predicates - current list of predicates.  This list will be mutated
   * @param filterText
   */
  const descriptionChanged = (predicates: Array<Predicate>, filterText: string) => {
    PredicateUtilities.removeMatchFromArray('description', predicates)
    PredicateUtilities.removeMatchFromArray('rate', predicates)
    if (filterText && filterText != '') {
      predicates.push(
        new Predicate({
          subject: new Predicate({
            subject: 'description',
            operator: Operators.LIKE,
            value: filterText
          }),
          operator: Operators.OR,
          value: new Predicate({
            subject: 'rate',
            operator: Operators.LIKE,
            value: filterText
          })
        })
      )
    }
  }

  const parseQueryFilter = (query: LocationQuery) => {
    const q = {
      ...structuredClone(query)
    }
    return q.$filter ? Parser.parse(q.$filter) : undefined
  }

  return {
    conditionChanged,
    descriptionChanged,
    parseQueryFilter,
    wantListChanged
  }
}

export default stampFilters()
