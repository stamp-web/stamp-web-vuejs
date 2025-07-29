import { ref } from 'vue'

export function useStampView() {
  const viewState = ref({
    mode: 'list',
    editorWidth: 'min-w-80 max-w-80'
  })

  const getViewMode = () => {
    return viewState.value.mode
  }

  const setViewMode = (mode: 'list' | 'card') => {
    viewState.value.mode = mode
  }

  const calculateEditorWidth = (isWantlist: boolean) => {
    return isWantlist ? 'min-w-80 max-w-80' : 'min-w-160 max-w-160'
  }

  return {
    getViewMode,
    setViewMode,
    calculateEditorWidth
  }
}
