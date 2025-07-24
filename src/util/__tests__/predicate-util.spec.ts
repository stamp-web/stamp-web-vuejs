import { Operators, Predicate } from 'odata-filter-parser'
import { describe, expect, it } from 'vitest'
import { PredicateUtilities } from '../predicate-util'

describe('PredicateUtilities', () => {
  describe('concat tests', () => {
    it('concat nothing', () => {
      const arr = [] as unknown[]
      const result = PredicateUtilities.concat(Operators.AND, arr)
      expect(result).toBeUndefined()
    })

    it('verify undefined dropped', () => {
      const arr = [undefined, new Predicate({ subject: 'test', value: 'test-v' })]
      const result = PredicateUtilities.concat(Operators.AND, arr)
      expect(result.flatten().length).toBe(1)
    })

    it('verify multiple concatentated', () => {
      const arr = [
        new Predicate({ subject: 'p1', value: 'v1' }),
        new Predicate({ subject: 'test', value: 'test-v' })
      ]
      const result = PredicateUtilities.concat(Operators.AND, arr)
      expect(result.flatten().length).toBe(2)
    })

    it('verify multiple undefines are not concatentated', () => {
      const arr = [
        new Predicate({ subject: 'p1', value: 'v1' }),
        undefined,
        new Predicate({ subject: 'test', value: 'test-v' }),
        undefined
      ]
      const result = PredicateUtilities.concat(Operators.AND, arr)
      expect(result.flatten().length).toBe(2)
    })
  })

  describe('removeMatchesByPredicate', () => {
    it('remove single matching item from array', () => {
      const ps = new Predicate({ subject: 'my-subject', value: 'something' })
      const result = PredicateUtilities.removeMatchesByPredicate('my-subject', ps)
      expect(result).toBe(undefined)
    })

    it('no removal without matching item from single array', () => {
      const ps = new Predicate({ subject: 'my-subject', value: 'something' })
      const result = PredicateUtilities.removeMatchesByPredicate('no removal', ps)
      expect(result.flatten().length).toBe(1)
    })

    it('no removal without matching item from array', () => {
      const result = PredicateUtilities.removeMatchesByPredicate(
        'no removal',
        Predicate.concat(Operators.AND, [
          new Predicate({ subject: 'my-subject', value: 'something' }),
          new Predicate({ subject: 'another-subject', value: 'something' }),
          new Predicate({ subject: 'yet-again-subject', value: 'something' })
        ])
      )
      expect(result.flatten().length).toBe(3)
    })

    it('removal matching first item from array', () => {
      const result = PredicateUtilities.removeMatchesByPredicate(
        'my-subject',
        Predicate.concat(Operators.AND, [
          new Predicate({ subject: 'my-subject', value: 'something' }),
          new Predicate({ subject: 'another-subject', value: 'something' }),
          new Predicate({ subject: 'yet-again-subject', value: 'something' })
        ])
      )
      expect(result.flatten().length).toBe(2)
    })

    it('removal matching last item from array', () => {
      const result = PredicateUtilities.removeMatchesByPredicate(
        'yet-again-subject',
        Predicate.concat(Operators.AND, [
          new Predicate({ subject: 'my-subject', value: 'something' }),
          new Predicate({ subject: 'another-subject', value: 'something' }),
          new Predicate({ subject: 'yet-again-subject', value: 'something' })
        ])
      )
      expect(result.flatten().length).toBe(2)
    })

    it('removal matching OR condition', () => {
      const result = PredicateUtilities.removeMatchesByPredicate(
        'condition',
        Predicate.concat(Operators.AND, [
          new Predicate({ subject: 'my-subject', value: 'something' }),
          new Predicate({
            subject: new Predicate({ subject: 'condition', value: 1 }),
            operator: Operators.OR,
            value: new Predicate({ subject: 'condition', value: 4 })
          }),
          new Predicate({ subject: 'yet-again-subject', value: 'something' })
        ])
      )
      expect(result.flatten().length).toBe(2)
    })

    it('removal nested condition with others', () => {
      const result = PredicateUtilities.removeMatchesByPredicate(
        'condition',
        Predicate.concat(Operators.AND, [
          new Predicate({ subject: 'name', value: 'something' }),
          new Predicate({
            subject: new Predicate({ subject: 'condition', value: 1 }),
            operator: Operators.OR,
            value: new Predicate({
              subject: new Predicate({ subject: 'condition', value: 2 }),
              operator: Operators.OR,
              value: new Predicate({
                subject: new Predicate({ subject: 'condition', value: 3 }),
                operator: Operators.OR,
                value: new Predicate({ subject: 'condition', value: 4 })
              })
            })
          })
        ])
      )
      expect(result.flatten().length).toBe(1)
    })

    it('removal matching only AND condition', () => {
      const result = PredicateUtilities.removeMatchesByPredicate(
        'condition',
        new Predicate({
          subject: new Predicate({ subject: 'condition', value: 1 }),
          operator: Operators.AND,
          value: new Predicate({ subject: 'condition', value: 4 })
        })
      )
      expect(result).toBe(undefined)
    })
  })

  describe('removeMatchFromArray', () => {
    it('no content', () => {
      const list = new Array<Predicate>()
      PredicateUtilities.removeMatchFromArray('test', list)
      expect(list.length).toBe(0)
    })

    it('no matches', () => {
      const list = [
        new Predicate({
          subject: 'test',
          operator: Operators.EQ,
          value: 'bar'
        }),
        new Predicate({
          subject: 'another',
          operator: Operators.GT,
          value: 42
        })
      ]
      PredicateUtilities.removeMatchFromArray('notFound', list)
      expect(list.length).toBe(2)
    })

    it('multiple condition scenario', () => {
      const list = [
        new Predicate({
          subject: 'test',
          operator: Operators.EQ,
          value: 'bar'
        }),
        new Predicate({
          subject: new Predicate({
            subject: 'condition',
            operator: Operators.EQ,
            value: 1
          }),
          operator: Operators.OR,
          value: new Predicate({
            subject: 'condition',
            operator: Operators.EQ,
            value: 2
          })
        })
      ]
      PredicateUtilities.removeMatchFromArray('condition', list)
      expect(list.length).toBe(1)
      expect(list[0].subject).toBe('test')
    })
  })
})
