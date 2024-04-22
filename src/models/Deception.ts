import localeUtil from '@/util/locale-utils'
import { EnumHelper } from '@/util/object-utils'
export enum Deception {
  FAKE_CANCEL = 2,
  FAKE_OVERPRINT = 4,
  FISCAL_REMOVED = 8,
  FORGERY = 16,
  FORGERY_POSSIBLE = 32,
  REPAIRED = 64,
  REPRINT = 128,
  REGUM = 256
}

export class DeceptionHelper {
  public static toString(value: number): string {
    // @ts-ignore
    const g = EnumHelper.enumToString(Deception, value)
    return g ? localeUtil.t(`deception.${g}`) : ''
  }
}
