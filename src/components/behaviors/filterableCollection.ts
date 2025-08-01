import type { PersistedNamedModel } from '@/models/entityModels'
import { reactive, computed } from 'vue'
import _isEmpty from 'lodash-es/isEmpty'
import LocalCache from '@/stores/LocalCache'
import { debounce } from '@/util/timer-utils'

/**
 * The filterableCollection behavior will add a reactive collection field that contains the following:
 *
 *   * list - Array of PersistedNamedModel entries
 *   * filteredList - an Array of PersistedNamedModel entries representing the filtered list
 *   * selected - the selected PersistedNamedModel entry for tracking selection in the list
 *   * filterString - string used to filter the list
 *
 *  There are methods added to filterCollection as well as set the selected model
 */
const useFilterableCollection = <T extends PersistedNamedModel>(
  filterKey = 'filter-text',
  customFilter?: (item: PersistedNamedModel, search: string) => boolean
) => {
  const collection = reactive({
    list: [] as T[],
    selected: undefined as T | undefined,
    filterString: LocalCache.getItem(filterKey) || ''
  })

  /**
   * Will use the local cache to set the filter string value, but will hold updates for ~ 500ms
   * since we may have filter updates coming in at a much higher rate (100-300ms) but it is not necessary
   * to store this in the local cache immediately since the local cache is only used for page refresh
   * restoring the local cache.
   */
  const updateLocalCache = debounce((value) => {
    LocalCache.setItem(filterKey, value as string)
  }, 500)

  const setCollection = (list: T[]) => {
    // @ts-expect-error: unwrapping the T array
    collection.list = list
  }

  const filterFunction =
    customFilter ||
    ((item: T, search: string) => {
      const upperSearch = search.toUpperCase()
      return (
        item.name.toUpperCase().includes(upperSearch) ||
        (item.description?.toUpperCase().includes(upperSearch) ?? false)
      )
    })

  const filteredList = computed(() => {
    const search = collection.filterString.trim()
    if (!search) return collection.list
    // @ts-expect-error: Unwrapping the T type
    return collection.list.filter((item) => filterFunction(item, search))
  })

  const setFilterString = (str: string) => {
    const trimmed = str.trim()
    if (collection.filterString !== trimmed) {
      collection.filterString = trimmed
      updateLocalCache(trimmed)
      //const list = filteredList.value
    }
  }

  const setSelected = (sel?: T) => {
    // @ts-expect-error: Unwrapping the T
    collection.selected = sel
  }

  const getSelected = computed(() =>
    _isEmpty(collection.selected) ? undefined : collection.selected
  )

  return {
    collection,
    list: computed(() => collection.list),
    filteredList,
    selected: getSelected,
    filterString: computed(() => collection.filterString),
    setCollection,
    setFilterString,
    setSelected
  }
}

export default useFilterableCollection
