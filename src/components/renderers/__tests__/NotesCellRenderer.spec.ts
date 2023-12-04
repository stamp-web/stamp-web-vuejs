import { describe, it, expect } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import NotesCellRenderer from '@/components/renderers/NotesCellRenderer.vue'
describe('NotesCellRenderer', () => {
  describe('computed', () => {
    function expectNoNotes(wrapper: VueWrapper) {
      // @ts-ignore
      expect(wrapper.vm.notesIcon).toBeUndefined()
      // @ts-ignore
      expect(wrapper.vm.tooltip).toBe('')
    }

    it('no stamp in row', () => {
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            path: 'stampOwnerships[0]'
          }
        }
      })
      expectNoNotes(wrapper)
    })

    it('wantlist stamp in row', () => {
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            data: {
              id: 123,
              wantlist: true,
              description: 'red'
            },
            path: 'stampOwnerships[0]'
          }
        }
      })
      expectNoNotes(wrapper)
    })

    it('has no notes, defects or deceptions', () => {
      const stamp = {
        id: 456,
        stampOwnerships: [{ id: 123, notes: '', deception: 0, defects: 0 }]
      }
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            data: stamp,
            path: 'stampOwnerships[0]'
          }
        }
      })
      expectNoNotes(wrapper)
    })

    it('has a note', () => {
      const stamp = {
        stampOwnerships: [{ id: 123, notes: 'this is noted', deception: 0, defects: 0 }]
      }
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            data: stamp,
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.notesIcon).toBe('sw-icon-info')
      // @ts-ignore
      expect(wrapper.vm.tooltip).toBe('this is noted')
    })

    it('has a note with defects', () => {
      const stamp = {
        stampOwnerships: [{ id: 123, notes: 'this is noted', deception: 0, defects: 18 }]
      }
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            data: stamp,
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.notesIcon).toBe('sw-icon-defect')
      // @ts-ignore
      const tooltip: string = wrapper.vm.tooltip
      expect(tooltip.includes('this is noted')).toBe(true)
      expect(tooltip.includes('Defects:')).toBe(true)
      expect(tooltip.includes('Creased')).toBe(true)
      expect(tooltip.includes('Thinned')).toBe(true)
    })

    it('has a note with deception', () => {
      const stamp = {
        stampOwnerships: [{ id: 123, notes: 'some notes', deception: 6, defects: 0 }]
      }
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            data: stamp,
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.notesIcon).toBe('sw-icon-attention')
      // @ts-ignore
      const tooltip: string = wrapper.vm.tooltip
      expect(tooltip.includes('some notes')).toBe(true)
      expect(tooltip.includes('Deception:')).toBe(true)
      expect(tooltip.includes('Fake Cancel')).toBe(true)
      expect(tooltip.includes('Fake Overprint')).toBe(true)
    })

    it('has a note with deception and defect', () => {
      const stamp = {
        stampOwnerships: [{ id: 123, notes: 'rough stamp', deception: 2, defects: 2 }]
      }
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            data: stamp,
            path: 'stampOwnerships[0]'
          }
        }
      })
      // @ts-ignore
      expect(wrapper.vm.notesIcon).toBe('sw-icon-attention')
      // @ts-ignore
      const tooltip: string = wrapper.vm.tooltip
      expect(tooltip.includes('rough stamp')).toBe(true)
      expect(tooltip.includes('Deception:')).toBe(true)
      expect(tooltip.includes('Defects:')).toBe(true)
      expect(tooltip.includes('Fake Cancel')).toBe(true)
      expect(tooltip.includes('Thinned')).toBe(true)
    })
  })
})
