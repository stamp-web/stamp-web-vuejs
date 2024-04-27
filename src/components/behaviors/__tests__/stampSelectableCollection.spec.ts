import { describe, it, expect } from 'vitest'
import stampSelectableCollection from '@/components/behaviors/stampSelectableCollection'
import type { Stamp } from '@/models/Stamp'
describe('stampSelectableCollection', () => {
  describe('isSelected', () => {
    it('not selected', () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: new Array<Stamp>(),
        selected: new Array<Stamp>()
      })
      const stamp = { description: 'test', id: 124 } as Stamp
      expect(sc.isSelected(stamp)).toBe(false)
    })

    it('selected', () => {
      const stamp = { description: 'test', id: 124 } as Stamp
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: [stamp],
        selected: [stamp]
      })
      expect(sc.isSelected(stamp)).toBe(true)
    })
  })

  describe('areAllSelected', () => {
    const list = [
      { id: 125, description: 'test' } as Stamp,
      { id: 456, description: 'foo' } as Stamp,
      { id: 789, description: 'baz' } as Stamp
    ]
    it('not all selected', () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: [list[0], list[1]],
        selected: list
      })
      expect(sc.areAllSelected()).toBe(false)
    })

    it('all selected', () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: list.slice(0, 2),
        selected: [list[0], list[1]]
      })
      expect(sc.areAllSelected()).toBe(true)
    })

    it('none are selected', () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: list,
        selected: new Array<Stamp>()
      })
      expect(sc.areAllSelected()).toBe(false)
    })
  })

  describe('areNoneSelected', () => {
    const list = [
      { id: 125, description: 'test' } as Stamp,
      { id: 456, description: 'foo' } as Stamp,
      { id: 789, description: 'baz' } as Stamp
    ]
    it('not all selected', () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: list,
        selected: [list[0], list[1]]
      })
      expect(sc.areNoneSelected()).toBe(false)
    })

    it('all selected', () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: list.slice(0, 2),
        selected: [list[0], list[1]]
      })
      expect(sc.areNoneSelected()).toBe(false)
    })

    it('none are selected', () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: list,
        selected: new Array<Stamp>()
      })
      expect(sc.areNoneSelected()).toBe(true)
    })
  })

  describe('isCollectionEmpty', () => {
    const list = [
      { id: 125, description: 'test' } as Stamp,
      { id: 456, description: 'foo' } as Stamp
    ]

    it('verify empty', () => {
      const sc = stampSelectableCollection()
      expect(sc.isCollectionEmpty()).toBe(true)
    })

    it('verify not empty', async () => {
      const sc = stampSelectableCollection()
      await sc.setCollection(list)
      expect(sc.isCollectionEmpty()).toBe(false)
    })
  })

  describe('setCollection', () => {
    it('verify collection setting resets selection', async () => {
      const list = [
        { id: 125, description: 'test' } as Stamp,
        { id: 456, description: 'foo' } as Stamp
      ]
      const sc = stampSelectableCollection()
      sc.setSelected({ id: 23, description: 'orange' } as Stamp)
      await sc.setCollection(list)
      expect(sc.getCollection()).toStrictEqual(list)
      expect(sc.getCurrentSelected().length).toBe(0)
    })
  })

  describe('setCollectionTotal', () => {
    it('verify total', () => {
      const sc = stampSelectableCollection()
      sc.setCollectionTotal(200)
      expect(sc.getCollectionTotal()).toBe(200)
    })
  })

  describe('updateCollectionEntry', () => {
    const list = [
      { id: 125, description: 'test' } as Stamp,
      { id: 456, description: 'foo' } as Stamp
    ]

    it('stamp not in collection', async () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({ list: list, selected: new Array<Stamp>() })
      await sc.updateCollectionEntry({ id: 555, description: 'red' } as Stamp)
      expect(sc.getCollection().length).toBe(3)
    })

    it('stamp updated in collection', async () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({ list: list, selected: new Array<Stamp>() })
      await sc.updateCollectionEntry({ id: 456, description: 'red' } as Stamp)
      expect(sc.getCollection().length).toBe(2)
      expect(sc.getCollection()[1].description).toBe('red')
    })

    it('stamp updated in collection and was selected', async () => {
      const sc = stampSelectableCollection()
      sc.initializeCollection({ list: list, selected: [list[1]] })
      await sc.updateCollectionEntry({ id: 456, description: 'red' } as Stamp)
      expect(sc.getCollection().length).toBe(2)
      expect(sc.getCollection()[1].description).toBe('red')
      expect(sc.getCurrentSelected().length).toBe(1)
      expect(sc.getCurrentSelected()[0].description).toBe('red')
    })
  })

  describe('setCurrentSelected', () => {
    const list = [
      { id: 125, description: 'test' } as Stamp,
      { id: 456, description: 'foo' } as Stamp
    ]

    it('verify new list is set', async () => {
      const sc = stampSelectableCollection()
      await sc.setCurrentSelected(list)
      expect(sc.getCurrentSelected().length).toBe(2)
    })
  })

  describe('setSelected', () => {
    const list = [
      { id: 125, description: 'test' } as Stamp,
      { id: 456, description: 'foo' } as Stamp,
      { id: 789, description: 'baz' } as Stamp,
      { id: 1100, description: 'bar' } as Stamp,
      { id: 1101, description: 'foo2' } as Stamp,
      { id: 1102, description: 'foo3' } as Stamp
    ]

    it('selected item', () => {
      const selected = new Array<Stamp>()
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list: list,
        selected: selected
      })
      sc.setSelected(list[1])
      expect(selected.length).toBe(1)
    })

    it('forward selection with shift', () => {
      const selected = [list[0], list[2]]
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list,
        selected
      })
      sc.setSelected(list[4], { shiftKey: true })
      expect(selected.length).toBe(4)
    })

    it('backward selection with shift', () => {
      const selected = [list[0], list[5]]
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list,
        selected
      })
      sc.setSelected(list[2], { shiftKey: true })
      expect(selected.length).toBe(5)
      expect(selected.includes(list[4]))
    })
  })

  describe('setDeselected', () => {
    it('deselect selected item', () => {
      const list = [
        { id: 125, description: 'test' } as Stamp,
        { id: 456, description: 'foo' } as Stamp
      ]
      const selected = [list[1]]
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list,
        selected
      })
      sc.setDeselected(list[1])
      expect(selected.length).toBe(0)
    })
  })

  describe('selectAll', () => {
    it('nothing currently selected', () => {
      const list = [
        { id: 125, description: 'test' } as Stamp,
        { id: 456, description: 'foo' } as Stamp
      ]
      const selected = new Array<Stamp>()
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list,
        selected
      })
      sc.selectAll()
      expect(selected.length).toBe(2)
    })

    it('partial currently selected', () => {
      const list = [
        { id: 125, description: 'test' } as Stamp,
        { id: 456, description: 'foo' } as Stamp
      ]
      const selected = [list[1]]
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list,
        selected
      })
      sc.selectAll()
      expect(selected.length).toBe(2)
    })

    it('verify deselect all', () => {
      const list = [
        { id: 125, description: 'test' } as Stamp,
        { id: 456, description: 'foo' } as Stamp
      ]
      const selected = [list[0], list[1]]
      const sc = stampSelectableCollection()
      sc.initializeCollection({
        list,
        selected
      })
      sc.selectAll(false)
      expect(selected.length).toBe(0)
    })
  })
})
