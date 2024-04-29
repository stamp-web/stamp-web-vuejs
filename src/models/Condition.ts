import localeUtil from '@/util/locale-utils'
import { EnumHelper } from '@/util/object-utils'

export const enum Condition {
  MINT = 0,
  MINT_NH = 1,
  USED = 2,
  CTO = 3,
  MINT_NG = 4,
  MINT_HH = 5,
  COVER = 6,
  ON_PAPER = 7,
  MANUSCRIPT = 8
}
export class ConditionHelper {
  static toString(value: number): string {
    // @ts-ignore
    const g = EnumHelper.enumToString(Condition, value)
    return g ? localeUtil.t(`condition.${g}`) : ''
  }

  static AllUsed(): Array<Condition> {
    return [Condition.USED, Condition.CTO, Condition.ON_PAPER]
  }

  static AllMint(): Array<Condition> {
    return [Condition.MINT, Condition.MINT_NG, Condition.MINT_NH, Condition.MINT_HH]
  }

  static AllPostalHistory(): Array<Condition> {
    return [Condition.COVER]
  }

  static isMint(condition: Condition): boolean {
    let result = false
    switch (condition) {
      case Condition.MINT_HH:
      case Condition.MINT_NH:
      case Condition.MINT_NG:
        result = true
        break
    }
    // switch doesn't work correctly with MINT since it is valued at 0
    result = result || (!result && condition === Condition.MINT)
    return result
  }

  static isUsed(condition: Condition): boolean {
    let result = false
    switch (condition) {
      case Condition.USED:
      case Condition.CTO:
      case Condition.MANUSCRIPT:
        result = true
        break
    }
    return result
  }

  static isOnCover(condition: Condition): boolean {
    let result = false
    switch (condition) {
      case Condition.COVER:
      case Condition.ON_PAPER:
        result = true
        break
    }
    return result
  }

  static isSameFamily(condition1: Condition, condition2: Condition): boolean {
    return (
      (ConditionHelper.isMint(condition1) && ConditionHelper.isMint(condition2)) ||
      (ConditionHelper.isUsed(condition1) && ConditionHelper.isUsed(condition2)) ||
      (ConditionHelper.isOnCover(condition1) && ConditionHelper.isOnCover(condition2))
    )
  }
}
