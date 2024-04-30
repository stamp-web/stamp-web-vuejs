import type { PersistedNamedModel } from '@/models/entityModels'
import { reactive } from 'vue'
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
const filterableCollection = (filterKey?: string) => {
  const FILTER_KEY: string = filterKey || 'filter-text'

  /**
   * Will use the local cache to set the filter string value, but will hold updates for ~ 500ms
   * since we may have filter updates coming in at a much higher rate (100-300ms) but it is not necessary
   * to store this in the local cache immediately since the local cache is only used for page refresh
   * restoring the local cache.
   */
  const UpdateLocalCache = debounce((value: string) => {
    LocalCache.setItem(FILTER_KEY, value)
  }, 500)

  const collection = reactive({
    list: new Array<PersistedNamedModel>(),
    filteredList: new Array<PersistedNamedModel>(),
    selected: {} as PersistedNamedModel | undefined,
    filterString: ''
  })

  const setCollection = (list: Array<PersistedNamedModel>) => {
    collection.list = list
  }

  const getCollection = () => {
    return collection.list
  }

  const filterCollection = (): Array<PersistedNamedModel> => {
    const searchString = collection.filterString.toUpperCase()
    collection.filteredList = collection.list.filter((item: PersistedNamedModel) => {
      return (
        item.name.toUpperCase().includes(searchString) ||
        (item.description && item.description.toUpperCase().includes(searchString))
      )
    })
    return collection.filteredList
  }

  const getFilteredList = () => {
    return collection.filteredList
  }

  const getFilterString = () => {
    if (collection.filterString === '') {
      collection.filterString = LocalCache.getItem(FILTER_KEY) || ''
    }
    return collection.filterString
  }

  const setFilterString = (str: string) => {
    collection.filterString = str
    UpdateLocalCache(str)
  }

  const getSelected = () => {
    // @ts-ignore
    return _isEmpty(collection.selected) ? undefined : collection.selected
  }

  const setSelected = (selected: PersistedNamedModel | undefined) => {
    collection.selected = selected
  }

  return {
    collection,
    getCollection,
    setCollection,
    filterCollection,
    getFilteredList,
    getFilterString,
    getSelected,
    setFilterString,
    setSelected
  }
}

export default filterableCollection
