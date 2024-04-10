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
}
