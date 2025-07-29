import { ref } from 'vue'
import type { PersistedModel } from '@/models/entityModels'

const editableModel = <T extends PersistedModel>() => {
  const editorShown = ref(false)
  const editingModel = ref<T>()

  const setEditModel = (model: T) => {
    editingModel.value = model
    showEditor()
  }

  const getEditModel = (): T => {
    return editingModel.value as T
  }

  const hideEditor = () => {
    editorShown.value = false
  }

  const showEditor = () => {
    editorShown.value = true
  }

  const isEditorShown = () => {
    return editorShown.value
  }

  return {
    setEditModel,
    getEditModel,
    editingModel,
    editorShown,
    hideEditor,
    showEditor,
    isEditorShown
  }
}

export default editableModel
