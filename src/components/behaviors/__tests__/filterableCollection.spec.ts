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
      expect(col.filteredList.value.length).toBe(0)
    })

    it('collection with no filter', () => {
      const col = filterableCollection()
      col.setCollection(fixedList)
      expect(col.filteredList.value.length).toBe(2)
    })

    it('collection with partial match filter on name', () => {
      const col = filterableCollection()
      col.setCollection(fixedList)
      col.setFilterString('TeSt')
      expect(col.filteredList.value.length).toBe(1)
    })

    it('collection with partial match filter on description', () => {
      const col = filterableCollection()
      col.setCollection(fixedList)
      col.setFilterString('some')
      expect(col.filteredList.value.length).toBe(1)
    })

    it('collection with no matches', () => {
      const col = filterableCollection()
      col.setCollection(fixedList)
      col.setFilterString('nomatch')
      expect(col.filteredList.value.length).toBe(0)
    })

    it('collection with whitespace filter', () => {
      const col = filterableCollection()
      col.setCollection(fixedList)
      col.setFilterString('   test   ')
      expect(col.filteredList.value.length).toBe(1)
    })
  })

  describe('setSelected', () => {
    it('verify selection state', () => {
      const col = filterableCollection()
      expect(col.selected.value).toBeUndefined()
      col.setSelected(fixedList[0])
      expect(col.selected.value).toEqual(fixedList[0])
    })
  })

  describe('getSelected', () => {
    it('verify selection state when empty', () => {
      const col = filterableCollection()
      expect(col.selected.value).toBeUndefined()
    })

    it('verify selection state when populated', () => {
      const col = filterableCollection()
      col.setSelected({ id: 5, name: 'test album' })
      expect(col.selected.value?.id).toBe(5)
    })
  })
})
