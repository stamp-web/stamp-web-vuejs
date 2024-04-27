import { describe, expect, it } from 'vitest'
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

  describe('AllUsed', () => {
    it('check default', () => {
      expect(ConditionHelper.AllUsed().length).toBe(3)
    })
  })

  describe('AllMint', () => {
    it('check default', () => {
      expect(ConditionHelper.AllMint().length).toBe(4)
    })
  })

  describe('AllPostalHistory', () => {
    it('check default', () => {
      expect(ConditionHelper.AllPostalHistory().length).toBe(1)
    })
  })

  describe('isOnCover', () => {
    it('validate positive conditions', () => {
      expect(ConditionHelper.isOnCover(Condition.ON_PAPER)).toBe(true)
      expect(ConditionHelper.isOnCover(Condition.COVER)).toBe(true)
    })

    it('validate other conditions', () => {
      expect(ConditionHelper.isOnCover(Condition.MINT)).toBe(false)
      expect(ConditionHelper.isOnCover(Condition.USED)).toBe(false)
    })
  })

  describe('isUsed', () => {
    it('validate positive conditions', () => {
      expect(ConditionHelper.isUsed(Condition.USED)).toBe(true)
      expect(ConditionHelper.isUsed(Condition.CTO)).toBe(true)
      expect(ConditionHelper.isUsed(Condition.MANUSCRIPT)).toBe(true)
    })

    it('validate other conditions', () => {
      expect(ConditionHelper.isUsed(Condition.MINT)).toBe(false)
      expect(ConditionHelper.isUsed(Condition.ON_PAPER)).toBe(false)
    })
  })
})
