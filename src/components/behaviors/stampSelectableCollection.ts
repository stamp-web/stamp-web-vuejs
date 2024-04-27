import type { Stamp } from '@/models/Stamp'
import { nextTick, reactive } from 'vue'

const stampSelectableCollection = () => {
  let data = reactive({
    list: new Array<Stamp>(),
    total: 0,
    selected: new Array<Stamp>()
  })

  const initializeCollection = (theRef: any) => {
    data = theRef
  }

  const setCollection = async (list: Array<Stamp>) => {
    data.list = []
    data.selected = [] // clear the selection whenever we set stamps
    await nextTick()
    data.list = list
  }

  const getCollection = () => {
    return data.list
  }

  async function updateCollectionEntry(savedStamp?: Stamp) {
    const currentList = getCollection()
    const currentSelected = getCurrentSelected()
    data.list = []
    data.selected = []
    let found = false
    await nextTick()
    currentList.forEach((stamp: Stamp) => {
      let comparator = stamp
      if (savedStamp && stamp.id === savedStamp.id) {
        data.list.push(savedStamp)
        comparator = savedStamp
        found = true
      } else {
        data.list.push(stamp)
      }
      if (currentSelected && currentSelected.some((s: Stamp) => s.id === comparator.id)) {
        data.selected.push(comparator)
      }
    })
    if (savedStamp && !found) {
      data.list.unshift(savedStamp)
    }
  }

  const isCollectionEmpty = (): boolean => {
    return data.list.length === 0
  }

  const isSelected = (stamp: Stamp): boolean => {
    // @ts-ignore
    return data.selected.includes(stamp)
  }

  const areAllSelected = () => {
    return data.list.length === data.selected.length
  }

  const areNoneSelected = () => {
    return data.selected.length < 1
  }

  const setSelected = (stamp: Stamp, options?: Partial<any>) => {
    const indx = data.selected.findIndex((s: Stamp) => s.id === stamp.id)
    if (indx < 0) {
      // @ts-ignore
      data.selected.push(stamp)
    }
    if (data.selected.length > 1 && options?.shiftKey) {
      const lastSelected: Stamp = data.selected[data.selected.length - 2]
      let lastIndex = data.list.findIndex((s: Stamp) => s.id === stamp.id)
      let startingIndx = data.list.findIndex((s: Stamp) => s.id === lastSelected.id)
      if (startingIndx > lastIndex) {
        const tempIndex = lastIndex
        lastIndex = startingIndx
        startingIndx = tempIndex
      }
      for (let i = startingIndx + 1; i < lastIndex; i++) {
        const currentStamp: Stamp = data.list[i]
        const c_indx = data.selected.findIndex((s: Stamp) => s.id === currentStamp.id)
        if (c_indx < 0) {
          // @ts-ignore
          data.selected.push(currentStamp)
        }
      }
    }
  }

  const setCollectionTotal = (total: number) => {
    data.total = total
  }

  const getCollectionTotal = () => {
    return data.total
  }

  const getCurrentSelected = () => {
    return data.selected
  }

  const setCurrentSelected = async (stamps: Array<Stamp>) => {
    data.selected = []
    await nextTick()
    // @ts-ignore
    data.selected = stamps
  }

  const setDeselected = (stamp: Stamp) => {
    const indx = data.selected.findIndex((s: Stamp) => s.id === stamp.id)
    if (indx >= 0) {
      data.selected.splice(indx, 1)
    }
  }

  const selectAll = (allSelect: boolean = true) => {
    data.selected.splice(
      0,
      data.selected.length,
      ...data.list.slice(0, allSelect ? data.list.length : 0)
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
    setSelected,
    setDeselected,
    selectAll,
    getCurrentSelected,
    setCurrentSelected
  }
}

export default stampSelectableCollection
