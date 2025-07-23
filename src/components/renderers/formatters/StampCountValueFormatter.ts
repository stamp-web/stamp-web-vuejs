import localeUtil from '@/util/locale-utils'

type RowCount = {
  value: number
}

export default function stampCount(rowObject?: RowCount) {
  const count = rowObject?.value || 0
  return localeUtil.t('cell.stamp-count', { count: count })
}
