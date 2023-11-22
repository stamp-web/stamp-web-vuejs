import { describe, it, expect } from 'vitest'
import editableModel from '@/components/behaviors/editableModel'

describe('editableModel', () => {
  describe('setEditModel', () => {
    it('shown and cloned', () => {
      const em = editableModel()
      const model = { id: 5, name: 'test' }
      em.setEditModel(model)
      expect(em.isEditorShown()).toBe(true)
      expect(em.getEditModel()).toStrictEqual(model)
      // logically the same but a clone
      expect(em.getEditModel()).not.toBe(model)
    })
  })
  describe('hideEditor', () => {
    it('hide it', () => {
      const em = editableModel()
      em.editorShown.value = true
      em.hideEditor()
      expect(em.isEditorShown()).toBe(false)
    })
  })
  describe('showEditor', () => {
    it('show it', () => {
      const em = editableModel()
      em.editorShown.value = false
      em.showEditor()
      expect(em.isEditorShown()).toBe(true)
    })
  })
})
