import localeUtil from '@/util/locale-utils'
import { EnumHelper } from '@/util/object-utils'

export enum Grade {
  XF = 0,
  VF = 1,
  FVF = 2,
  F = 3,
  VG = 4,
  D = 5,
  CTS = 6
}

export class GradeHelper {
  static toString(value: number): string {
    const g = EnumHelper.enumToString(Grade, value)
    return g ? localeUtil.t(`grade.${g}`) : ''
  }
}
