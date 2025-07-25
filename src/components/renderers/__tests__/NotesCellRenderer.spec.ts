import { describe, it, expect } from 'vitest'
import { mount, shallowMount, VueWrapper } from '@vue/test-utils'

import NotesCellRenderer from '@/components/renderers/NotesCellRenderer.vue'
import { type Ownership } from '@/models/Ownership'
import { createInstance } from '@/models/entityModels'
import { type Stamp } from '@/models/Stamp'

type NotesCellRendererType = InstanceType<typeof NotesCellRenderer> & {
  notesIcon: string | undefined
  tooltip: string
}

describe('NotesCellRenderer', () => {
  describe('computed', () => {
    function expectNoNotes(wrapper: VueWrapper<NotesCellRendererType>) {
      expect(wrapper.vm.notesIcon).toBeUndefined()
      expect(wrapper.vm.tooltip).toBe('')
    }

    // eslint-disable-next-line vitest/expect-expect
    it('no stamp in row', () => {
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            data: {},
            path: 'stampOwnerships[0]'
          }
        }
      }) as VueWrapper<NotesCellRendererType>
      expectNoNotes(wrapper)
    })

    // eslint-disable-next-line vitest/expect-expect
    it('wantList stamp in row', () => {
      const wrapper = shallowMount(NotesCellRenderer, {
        propsData: {
          params: {
            data: {
              id: 123,
              wantList: true,
              description: 'red'
            },
            path: 'stampOwnerships[0]'
          }
        }
      }) as VueWrapper<NotesCellRendererType>
      expectNoNotes(wrapper)
    })

    // eslint-disable-next-line vitest/expect-expect
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
      }) as VueWrapper<NotesCellRendererType>
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
      }) as VueWrapper<NotesCellRendererType>
      expect(wrapper.vm.notesIcon).toBe('sw-icon-info')
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
      }) as VueWrapper<NotesCellRendererType>
      expect(wrapper.vm.notesIcon).toBe('sw-icon-defect')
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
      }) as VueWrapper<NotesCellRendererType>
      expect(wrapper.vm.notesIcon).toBe('sw-icon-attention')
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
      }) as VueWrapper<NotesCellRendererType>
      expect(wrapper.vm.notesIcon).toBe('sw-icon-attention')
      const tooltip: string = wrapper.vm.tooltip
      expect(tooltip.includes('rough stamp')).toBe(true)
      expect(tooltip.includes('Deception:')).toBe(true)
      expect(tooltip.includes('Defects:')).toBe(true)
      expect(tooltip.includes('Fake Cancel')).toBe(true)
      expect(tooltip.includes('Thinned')).toBe(true)
    })
  })

  describe('notesIcon computed', () => {
    const createWrapper = (props = {}) => {
      return mount(NotesCellRenderer, {
        props
      })
    }

    it('should return undefined when no data is provided', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('span.icon-cell').exists()).toBe(false)
    })

    it('should show attention icon when ownership has deception', () => {
      const ownership = createInstance<Ownership>({
        id: 1,
        deception: 1,
        defects: 0,
        notes: ''
      })

      const wrapper = createWrapper({
        params: {
          data: { ownership },
          path: 'ownership'
        }
      })
      expect(wrapper.find('span.icon-cell').classes()).toContain('sw-icon-attention')
    })

    it('should show defect icon when ownership has defects but no deception', () => {
      const ownership = createInstance<Ownership>({
        id: 1,
        deception: 0,
        defects: 1,
        notes: ''
      })

      const wrapper = createWrapper({
        params: {
          data: { ownership },
          path: 'ownership'
        }
      })

      expect(wrapper.find('span.icon-cell').classes()).toContain('sw-icon-defect')
    })

    it('should show info icon when ownership has notes but no defects or deception', () => {
      const ownership = createInstance<Ownership>({
        id: 1,
        deception: 0,
        defects: 0,
        notes: 'Test note'
      })

      const wrapper = createWrapper({
        params: {
          data: { ownership },
          path: 'ownership'
        }
      })

      expect(wrapper.find('span.icon-cell').classes()).toContain('sw-icon-info')
    })

    it('should handle direct stamp prop instead of params', () => {
      const ownership = createInstance<Ownership>({
        id: 1,
        deception: 1,
        defects: 0,
        notes: 'Test note'
      })
      const stamp = createInstance<Stamp>({
        stampOwnerships: [ownership]
      })

      const wrapper = createWrapper({
        stamp,
        path: 'stampOwnerships[0]'
      })

      expect(wrapper.find('span.icon-cell').classes()).toContain('sw-icon-attention')
    })

    it('should handle empty or invalid paths', () => {
      const wrapper = createWrapper({
        params: {
          data: {},
          path: 'invalid.path'
        }
      })

      expect(wrapper.find('span.icon-cell').exists()).toBe(false)
    })

    it('should prioritize deception over defects and notes', () => {
      const ownership = createInstance<Ownership>({
        id: 1,
        deception: 32,
        defects: 16,
        notes: 'Test note'
      })

      const wrapper = createWrapper({
        params: {
          data: { ownership },
          path: 'ownership'
        }
      })

      expect(wrapper.find('span.icon-cell').classes()).toContain('sw-icon-attention')
    })
  })
})
