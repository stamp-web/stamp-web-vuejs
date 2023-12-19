import type { Stamp } from '@/models/Stamp'

const stampSelectableCollection = (list: Array<Stamp>, selected: Array<Stamp>) => {
  const isSelected = (stamp: Stamp): boolean => {
    return selected.includes(stamp)
  }

  const areAllSelected = () => {
    return list.length === selected.length
  }

  const areNoneSelected = () => {
    return selected.length < 1
  }

  const setSelected = (stamp: Stamp, options?: Partial<any>) => {
    const indx = selected.findIndex((s) => s.id === stamp.id)
    if (indx < 0) {
      selected.push(stamp)
    }
    if (selected.length > 1 && options?.shiftKey) {
      const lastSelected = selected[selected.length - 2]
      let lastIndex = list.findIndex((s) => s.id === stamp.id)
      let startingIndx = list.findIndex((s) => s.id === lastSelected.id)
      if (startingIndx > lastIndex) {
        const tempIndex = lastIndex
        lastIndex = startingIndx
        startingIndx = tempIndex
      }
      for (let i = startingIndx + 1; i < lastIndex; i++) {
        const currentStamp = list[i]
        const c_indx = selected.findIndex((s) => s.id === currentStamp.id)
        if (c_indx < 0) {
          selected.push(currentStamp)
        }
      }
    }
  }

  const setDeselected = (stamp: Stamp) => {
    const indx = selected.findIndex((s) => s.id === stamp.id)
    if (indx >= 0) {
      selected.splice(indx, 1)
    }
  }

  const selectAll = (allSelect: boolean = true) => {
    selected.splice(0, selected.length, ...list.slice(0, allSelect ? list.length : 0))
  }

  return {
    areAllSelected,
    areNoneSelected,
    isSelected,
    setSelected,
    setDeselected,
    selectAll
  }
}

export default stampSelectableCollection
