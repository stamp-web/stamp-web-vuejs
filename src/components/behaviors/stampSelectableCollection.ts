import type { Stamp } from '@/models/Stamp'
import { nextTick, ref } from 'vue'

type selectionOptions = {
  shiftKey?: boolean
}

type selecteableCollectionData = {
  list: Stamp[]
  total: number
  selected: Stamp[]
}
const stampSelectableCollection = () => {
  const data = ref<selecteableCollectionData>({
    list: new Array<Stamp>(),
    total: 0,
    selected: new Array<Stamp>()
  })

  const initializeCollection = (theRef: selecteableCollectionData) => {
    data.value = theRef
  }

  const setCollection = async (list: Array<Stamp>, clearSelection: boolean = false) => {
    data.value.list = list
    if (clearSelection) {
      await setCurrentSelected(new Array<Stamp>())
    }
  }

  const getCollection = () => {
    return data.value.list
  }

  async function updateCollectionEntry(savedStamp?: Stamp) {
    const currentList = getCollection()
    const currentSelected = getCurrentSelected()
    const list = new Array<Stamp>()
    const selected = new Array<Stamp>()
    let found = false
    currentList.forEach((stamp: Stamp) => {
      let comparator = stamp
      if (savedStamp && stamp.id === savedStamp.id) {
        list.push(savedStamp)
        comparator = savedStamp
        found = true
      } else {
        list.push(stamp)
      }
      if (currentSelected && currentSelected.some((s: Stamp) => s.id === comparator.id)) {
        selected.push(comparator)
      }
    })
    if (savedStamp && !found) {
      list.unshift(savedStamp)
    }
    await setCollection(list)
    await setCurrentSelected(selected)
  }

  async function removeCollectionEntries(stamps: Array<Stamp>) {
    const col = getCollection()
    const sel = getCurrentSelected()
    setCollection(new Array<Stamp>())
    await nextTick()
    const findAndRemove = (col: Array<Stamp>, stamp: Stamp) => {
      const selIndex = col
        .map((sel) => {
          return sel.id
        })
        .indexOf(stamp.id)
      if (selIndex >= 0) {
        col.splice(selIndex, 1)
      }
    }
    stamps.forEach((stamp: Stamp) => {
      findAndRemove(sel, stamp)
      findAndRemove(col, stamp)
    })
    await setCollection(col)
    await setCurrentSelected(sel)
  }

  const isCollectionEmpty = (): boolean => {
    return data.value.list.length === 0
  }

  const isSelected = (stamp: Stamp): boolean => {
    // @ts-ignore
    return data.value.selected.includes(stamp)
  }

  const areAllSelected = () => {
    return data.value.list.length === data.value.selected.length
  }

  const areNoneSelected = () => {
    return data.value.selected.length < 1
  }

  const setSelected = (stamp: Stamp, options?: selectionOptions) => {
    const indx = data.value.selected.findIndex((s: Stamp) => s.id === stamp.id)
    if (indx < 0) {
      // @ts-ignore
      data.value.selected.push(stamp)
    }
    if (data.value.selected.length > 1 && options?.shiftKey) {
      const lastSelected: Stamp = data.value.selected[data.value.selected.length - 2]
      let lastIndex = data.value.list.findIndex((s: Stamp) => s.id === stamp.id)
      let startingIndx = data.value.list.findIndex((s: Stamp) => s.id === lastSelected.id)
      if (startingIndx > lastIndex) {
        const tempIndex = lastIndex
        lastIndex = startingIndx
        startingIndx = tempIndex
      }
      for (let i = startingIndx + 1; i < lastIndex; i++) {
        const currentStamp: Stamp = data.value.list[i]
        const c_indx = data.value.selected.findIndex((s: Stamp) => s.id === currentStamp.id)
        if (c_indx < 0) {
          // @ts-ignore
          data.value.selected.push(currentStamp)
        }
      }
    }
  }

  const setCollectionTotal = (total: number) => {
    data.value.total = total
  }

  const getCollectionTotal = () => {
    return data.value.total
  }

  const getCurrentSelected = () => {
    return data.value.selected
  }

  const setCurrentSelected = async (stamps: Array<Stamp>) => {
    data.value.selected = stamps
  }

  const setDeselected = (stamp: Stamp) => {
    const indx = data.value.selected.findIndex((s: Stamp) => s.id === stamp.id)
    if (indx >= 0) {
      data.value.selected.splice(indx, 1)
    }
  }

  const selectAll = (allSelect: boolean = true) => {
    data.value.selected.splice(
      0,
      data.value.selected.length,
      ...data.value.list.slice(0, allSelect ? data.value.list.length : 0)
    )
  }

  return {
    initializeCollection,
    getCollection,
    setCollection,
    isCollectionEmpty,
    updateCollectionEntry,
    getCollectionTotal,
    setCollectionTotal,
    areAllSelected,
    areNoneSelected,
    isSelected,
    removeCollectionEntries,
    setSelected,
    setDeselected,
    selectAll,
    getCurrentSelected,
    setCurrentSelected
  }
}

export default stampSelectableCollection
