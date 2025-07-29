import { describe, it, expect } from 'vitest'
import { useStampView } from '@/views/behaviors/stampView'

describe('useStampView', () => {
  describe('view mode management', () => {
    it('should initialize with list mode', () => {
      const { getViewMode } = useStampView()
      expect(getViewMode()).toBe('list')
    })

    it('should change view mode to card', () => {
      const { getViewMode, setViewMode } = useStampView()
      setViewMode('card')
      expect(getViewMode()).toBe('card')
    })

    it('should change view mode back to list', () => {
      const { getViewMode, setViewMode } = useStampView()
      setViewMode('card')
      setViewMode('list')
      expect(getViewMode()).toBe('list')
    })
  })

  describe('editor width calculation', () => {
    it('should return narrow width for wantlist items', () => {
      const { calculateEditorWidth } = useStampView()
      expect(calculateEditorWidth(true)).toBe('min-w-80 max-w-80')
    })

    it('should return wide width for regular stamps', () => {
      const { calculateEditorWidth } = useStampView()
      expect(calculateEditorWidth(false)).toBe('min-w-160 max-w-160')
    })
  })
})
