import localeUtil from '@/util/locale-utils'
import { EnumHelper } from '@/util/object-utils'
export enum Defects {
  THIN = 2,
  TORN = 4,
  TONED_PAPER = 8,
  CREASED = 16,
  SCUFFED = 32,
  PINHOLE = 64,
  SHORT_PERF = 128,
  STUNTED_PERF = 256,
  CLIPPED = 512,
  FADING = 1024,
  BLEEDING = 2048,
  INK_STAIN = 4096,
  CHANGELING = 8192,
  CRACKED_GUM = 16384,
  TONED_GUM = 32768,
  HEAVILY_HINGED = 65536,
  ALBUM_TRANSFER = 131072,
  PAPER_ADHESION = 262144,
  SOILED = 524288
}

export class DefectsHelper {
  public static toString(value: number): string {
    // @ts-ignore
    const g = EnumHelper.enumToString(Defects, value)
    return g ? localeUtil.t(`defects.${g}`) : ''
  }
}
