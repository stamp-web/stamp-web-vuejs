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
}
