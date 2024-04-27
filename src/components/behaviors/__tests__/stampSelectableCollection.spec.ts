import { describe, it, expect } from 'vitest'
import stampSelectableCollection from '@/components/behaviors/stampSelectableCollection'
import type { Stamp } from '@/models/Stamp'
describe('stampSelectableCollection', () => {
  describe('isSelected', () => {
    it('not selected', () => {
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list: new Array<Stamp>(),
        selected: new Array<Stamp>()
      })
      const stamp = { description: 'test', id: 124 } as Stamp
      expect(sc.isSelected(stamp)).toBe(false)
    })

    it('selected', () => {
      const stamp = { description: 'test', id: 124 } as Stamp
      const sc = stampSelectableCollection
      sc.initializeSelected({
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
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list: [list[0], list[1]],
        selected: list
      })
      expect(sc.areAllSelected()).toBe(false)
    })

    it('all selected', () => {
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list: list.slice(0, 2),
        selected: [list[0], list[1]]
      })
      expect(sc.areAllSelected()).toBe(true)
    })

    it('none are selected', () => {
      const sc = stampSelectableCollection
      sc.initializeSelected({
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
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list: list,
        selected: [list[0], list[1]]
      })
      expect(sc.areNoneSelected()).toBe(false)
    })

    it('all selected', () => {
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list: list.slice(0, 2),
        selected: [list[0], list[1]]
      })
      expect(sc.areNoneSelected()).toBe(false)
    })

    it('none are selected', () => {
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list: list,
        selected: new Array<Stamp>()
      })
      expect(sc.areNoneSelected()).toBe(true)
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
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list: list,
        selected: selected
      })
      sc.setSelected(list[1])
      expect(selected.length).toBe(1)
    })

    it('forward selection with shift', () => {
      const selected = [list[0], list[2]]
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list,
        selected
      })
      sc.setSelected(list[4], { shiftKey: true })
      expect(selected.length).toBe(4)
    })

    it('backward selection with shift', () => {
      const selected = [list[0], list[5]]
      const sc = stampSelectableCollection
      sc.initializeSelected({
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
      const sc = stampSelectableCollection
      sc.initializeSelected({
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
      const sc = stampSelectableCollection
      sc.initializeSelected({
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
      const sc = stampSelectableCollection
      sc.initializeSelected({
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
      const sc = stampSelectableCollection
      sc.initializeSelected({
        list,
        selected
      })
      sc.selectAll(false)
      expect(selected.length).toBe(0)
    })
  })
})
