import { CurrencyCode } from '@/models/CurrencyCode'
import { type PersistedNamedModel } from '@/models/entityModels'
import { EnumHelper } from '@/util/object-utils'
import localeUtil from '@/util/locale-utils'

export type Catalogue = PersistedNamedModel & {
  issue: number
  type: number
  code: CurrencyCode
}

export enum CatalogueType {
  STANLEY_GIBBONS = 0,
  SCOTT = 1,
  MICHEL = 2,
  FACIT = 3,
  OTHER = 4,
  DARNELL = 5,
  BRIDGER_AND_KAY = 6,
  VAN_DAM = 7,
  JSCA = 8
}
export class CatalogueModelHelper {
  static getPrefix(catalogue: Catalogue): string {
    let prefix = ''
    if (catalogue) {
      switch (catalogue.type) {
        case CatalogueType.SCOTT:
          prefix = 'sc'
          break
      }
    }
    return prefix
  }

  static toString(value: number): string {
    const c = EnumHelper.enumToString(CatalogueType, value)
    return c ? localeUtil.t(`catalogueType.${c}`) : ''
  }
}
