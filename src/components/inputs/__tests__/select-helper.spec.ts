import { describe, it, expect, vi, beforeEach } from 'vitest'
import { scrollOnOpen, type SelectElementInstance } from '../select-helper'
import { nextTick } from 'vue'
import type { SelectElement } from '@vueform/vueform'

vi.mock('vue', () => ({
  nextTick: vi.fn()
}))

describe('select-helper', () => {
  let mockInstance: SelectElementInstance
  let mockScrollIntoView: ReturnType<typeof vi.fn>
  let mockQuerySelector: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockScrollIntoView = vi.fn()
    mockQuerySelector = vi.fn().mockReturnValue([
      { innerText: 'Item 1', scrollIntoView: mockScrollIntoView },
      { innerText: 'Item 2', scrollIntoView: mockScrollIntoView }
    ])

    // Create base Mock for SelectElement
    const baseSelectElement: Partial<SelectElement> = {
      input: {
        dropdown: {
          querySelectorAll: mockQuerySelector
        } as unknown as HTMLElement
      } as unknown as HTMLDivElement
    }

    mockInstance = {
      ...baseSelectElement,
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ],
      data: {
        selectedItem: 1
      }
    } as SelectElementInstance
  })

  describe('scrollOnOpen', () => {
    it('should scroll to the selected item', async () => {
      await scrollOnOpen(mockInstance, 'selectedItem')
      expect(mockQuerySelector).toHaveBeenCalledWith('span')
      expect(nextTick).toHaveBeenCalled()
      expect(mockScrollIntoView).toHaveBeenCalledWith(true)
    })

    it('should not scroll if no matching item is found', async () => {
      mockInstance.data.selectedItem = 999 // Non-existent ID
      await scrollOnOpen(mockInstance, 'selectedItem')
      expect(mockScrollIntoView).not.toHaveBeenCalled()
    })

    it('should not scroll if no matching span element is found', async () => {
      mockQuerySelector.mockReturnValueOnce([
        { innerText: 'Different Text', scrollIntoView: mockScrollIntoView }
      ])
      await scrollOnOpen(mockInstance, 'selectedItem')
      expect(mockScrollIntoView).not.toHaveBeenCalled()
    })

    it('should use custom prop for matching if provided', async () => {
      mockInstance.items = [
        { customId: 1, name: 'Item 1' },
        { customId: 2, name: 'Item 2' }
      ]
      await scrollOnOpen(mockInstance, 'selectedItem', 'customId')
      expect(mockScrollIntoView).toHaveBeenCalledWith(true)
    })

    it('should handle empty items array', async () => {
      mockInstance.items = []
      await scrollOnOpen(mockInstance, 'selectedItem')
      expect(mockScrollIntoView).not.toHaveBeenCalled()
    })

    it('should handle null instance', async () => {
      await scrollOnOpen(undefined, 'selectedItem')
      expect(mockScrollIntoView).not.toHaveBeenCalled()
    })

    it('should handle instance without items', async () => {
      const incompleteInstance: Partial<SelectElementInstance> = {
        input: mockInstance.input,
        data: mockInstance.data
      }
      await scrollOnOpen(incompleteInstance as SelectElementInstance, 'selectedItem')
      expect(mockScrollIntoView).not.toHaveBeenCalled()
    })
  })
})
