import type { Stamp } from '@/models/Stamp'

const stampSelectableCollection = () => {
  let ref: any

  const initializeSelected = (theRef: any) => {
    ref = theRef
  }
  const isSelected = (stamp: Stamp): boolean => {
    return ref.selected.includes(stamp)
  }

  const areAllSelected = () => {
    return ref.list.length === ref.selected.length
  }

  const areNoneSelected = () => {
    return ref.selected.length < 1
  }

  const setSelected = (stamp: Stamp, options?: Partial<any>) => {
    const indx = ref.selected.findIndex((s: Stamp) => s.id === stamp.id)
    if (indx < 0) {
      ref.selected.push(stamp)
    }
    if (ref.selected.length > 1 && options?.shiftKey) {
      const lastSelected = ref.selected[ref.selected.length - 2]
      let lastIndex = ref.list.findIndex((s: Stamp) => s.id === stamp.id)
      let startingIndx = ref.list.findIndex((s: Stamp) => s.id === lastSelected.id)
      if (startingIndx > lastIndex) {
        const tempIndex = lastIndex
        lastIndex = startingIndx
        startingIndx = tempIndex
      }
      for (let i = startingIndx + 1; i < lastIndex; i++) {
        const currentStamp = ref.list[i]
        const c_indx = ref.selected.findIndex((s: Stamp) => s.id === currentStamp.id)
        if (c_indx < 0) {
          ref.selected.push(currentStamp)
        }
      }
    }
  }

  const setDeselected = (stamp: Stamp) => {
    const indx = ref.selected.findIndex((s: Stamp) => s.id === stamp.id)
    if (indx >= 0) {
      ref.selected.splice(indx, 1)
    }
  }

  const selectAll = (allSelect: boolean = true) => {
    ref.selected.splice(
      0,
      ref.selected.length,
      ...ref.list.slice(0, allSelect ? ref.list.length : 0)
    )
  }

  return {
    initializeSelected,
    areAllSelected,
    areNoneSelected,
    isSelected,
    setSelected,
    setDeselected,
    selectAll
  }
}

export default stampSelectableCollection()
