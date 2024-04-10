import localeUtil from '@/util/locale-utils'
export default function stampCount(rowObject: any) {
  return localeUtil.t('cell.stamp-count', { count: rowObject.value || 0 })
}
