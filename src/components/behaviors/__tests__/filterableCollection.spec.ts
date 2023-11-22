import { describe, it, expect } from 'vitest'
import filterableCollection from '@/components/behaviors/filterableCollection'

describe('filterableCollection', () => {
  const fixedList = [
    { id: 1, name: 'test', description: 'test description' },
    { id: 2, name: 'another', description: 'some desc' }
  ]
  describe('filterCollection', () => {
    it('empty collection with no filter', () => {
      const col = filterableCollection()
      col.filterCollection()
      expect(col.collection.filteredList.length).toBe(0)
    })

    it('collection with no filter', () => {
      const col = filterableCollection()
      // @ts-ignore
      col.collection.list = fixedList
      col.filterCollection()
      expect(col.collection.filteredList.length).toBe(2)
    })

    it('collection with partial match filter on name', () => {
      const col = filterableCollection()
      // @ts-ignore
      col.collection.list = fixedList
      col.collection.filterString = 'TeSt'
      col.filterCollection()
      expect(col.collection.filteredList.length).toBe(1)
    })

    it('collection with partial match filter on description', () => {
      const col = filterableCollection()
      // @ts-ignore
      col.collection.list = fixedList
      col.collection.filterString = 'some'
      col.filterCollection()
      expect(col.collection.filteredList.length).toBe(1)
    })

    it('collection with match all filter', () => {
      const col = filterableCollection()
      // @ts-ignore
      col.collection.list = fixedList
      col.collection.filterString = 'dEsC'
      col.filterCollection()
      expect(col.collection.filteredList.length).toBe(2)
    })
  })

  describe('setSelected', () => {
    it('verify selection state', () => {
      const col = filterableCollection()
      expect(col.collection.selected).toStrictEqual({})
      col.setSelected(fixedList[0])
      expect(col.collection.selected).toStrictEqual(fixedList[0])
    })
  })

  describe('getSelected', () => {
    it('verify selection state when empty', () => {
      const col = filterableCollection()
      expect(col.getSelected()).toBeUndefined()
    })

    it('verify selection state when populated', () => {
      const col = filterableCollection()
      col.collection.selected = { id: 5, name: 'test album' }
      const val = col.getSelected()
      expect(val).not.toBeUndefined()
      // @ts-ignore
      expect(val.id).toBe(5)
    })
  })
})
