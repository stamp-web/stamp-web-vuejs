import { describe, it, expect } from 'vitest'
import { Condition, ConditionHelper } from '@/models/Condition'

describe('ConditionHelper tests', () => {
  describe('toString tests', () => {
    it('validate each value', () => {
      expect(ConditionHelper.toString(Condition.MINT)).toBe('Mint')
      expect(ConditionHelper.toString(Condition.CTO)).toBe('Cancel to Order')
      expect(ConditionHelper.toString(Condition.ON_PAPER)).toBe('Used on Paper')
      expect(ConditionHelper.toString(Condition.USED)).toBe('Used')
      expect(ConditionHelper.toString(Condition.COVER)).toBe('Used on Cover')
      expect(ConditionHelper.toString(Condition.MANUSCRIPT)).toBe('Manuscript Cancel')
      expect(ConditionHelper.toString(Condition.MINT_NH)).toBe('Mint (NH)')
      expect(ConditionHelper.toString(Condition.MINT_NG)).toBe('Mint (No gum)')
      expect(ConditionHelper.toString(Condition.MINT_HH)).toBe('Mint (heavily hinged)')
    })
  })
})
