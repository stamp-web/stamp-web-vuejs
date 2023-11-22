import { ref } from 'vue'
import type { PersistedModel } from '@/models/entityModels'
import cloneDeep from 'lodash-es/cloneDeep'

const editableModel = () => {
  const editorShown = ref(false)
  const editingModel = ref<PersistedModel>()

  const setEditModel = (model: PersistedModel) => {
    editingModel.value = cloneDeep(model)
    showEditor()
  }

  const getEditModel = () => {
    return editingModel.value
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
