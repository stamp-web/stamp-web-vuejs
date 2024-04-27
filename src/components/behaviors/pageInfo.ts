import { computed, ref } from 'vue'
import LocalCache from '@/stores/LocalCache'

const pageInfo = (filterKey?: string) => {
  const FILTER_KEY = filterKey || 'pagingInfo'

  const info = ref({
    active: 1, // current page
    total: 1, // total pages
    size: Number.parseInt(LocalCache.getItem(`${FILTER_KEY}.pageSize`) || '1000'),
    list: new Array<Object>()
  })

  const setActivePage = (page: number): void => {
    info.value.active = Math.min(Math.max(page, 1), info.value.total)
  }

  const setPageCount = (total: number): void => {
    info.value.total = total
  }

  const setPageSize = (size: number): void => {
    if (info.value.size !== size) {
      LocalCache.setItem(`${FILTER_KEY}.pageSize`, size.toString())
      info.value.size = Math.max(size, 10)
    }
  }

  const setPagingItems = (list: Array<Object>) => {
    info.value.list = list
  }

  const getActivePage = (): number => {
    return info.value.active
  }

  const getPageSize = (): number => {
    return info.value.size
  }

  const getPageCount = (): number => {
    return info.value.total
  }

  const calculatePagingStats = (total: number): void => {
    setPageCount(Math.ceil(total / getPageSize()))
    setActivePage(getActivePage() > 1 ? getActivePage() : 1)
  }

  const startingCount = computed(() => {
    return (info.value.active - 1) * info.value.size + 1
  })

  const endingCount = computed(() => {
    return (info.value.active - 1) * info.value.size + info.value.list.length
  })

  return {
    startingCount,
    endingCount,
    setActivePage,
    setPageCount,
    setPageSize,
    setPagingItems,
    getPageSize,
    getPageCount,
    getActivePage,
    calculatePagingStats
  }
}

export default pageInfo
