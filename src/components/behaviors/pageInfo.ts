import { computed, ref } from 'vue'

const pageInfo = (list: Array<Object>) => {
  const info = ref({
    active: 1, // current page
    total: 1, // total pages
    size: 1000
  })

  const setActivePage = (page: number): void => {
    info.value.active = Math.min(Math.max(page, 1), info.value.total)
  }

  const setPageCount = (total: number): void => {
    info.value.total = total
  }

  const setPageSize = (size: number): void => {
    info.value.size = Math.max(size, 10)
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
    return (info.value.active - 1) * info.value.size + list.length
  })

  return {
    startingCount,
    endingCount,
    setActivePage,
    setPageCount,
    setPageSize,
    getPageSize,
    getPageCount,
    getActivePage,
    calculatePagingStats
  }
}

export default pageInfo
