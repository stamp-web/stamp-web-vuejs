import localeUtil from '@/util/locale-utils'
import { EnumHelper } from '@/util/object-utils'
export enum ReportType {
  CatalogueValue = 2,
  CostBasis = 4,
  CashValue = 8
}

export class ReportTypeHelper {
  public static toString(value: number): string {
    // @ts-ignore
    const g = EnumHelper.enumToString(ReportType, value)
    return g ? localeUtil.t(`reportType.${g}`) : ''
  }

  public static toArray() {
    const values: { label: string; value: string }[] = []
    Object.keys(ReportType).forEach((key, index) => {
      if (index > 1) {
        return
      }
      const labelKey = EnumHelper.enumToString(ReportType, key)
      values.push({ label: localeUtil.t(`reportType.${labelKey}`), value: key })
    })
    return values
  }
}
