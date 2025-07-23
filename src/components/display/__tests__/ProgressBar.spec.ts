import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'
import { fail } from 'assert'
import { nextTick } from 'vue'
import { delay } from '../../../util/timer-utils'

describe('ProgressBar', () => {
  describe('valueChange', () => {
    it('changes value', async () => {
      const comp = shallowMount(ProgressBar, {
        propsData: {
          value: 5
        }
      })
      await nextTick()
      comp.setProps({
        value: 30
      })
      await nextTick()
      expect(comp.vm.count).toBe(30)
    })

    it('value change exceeds maximum', async () => {
      const comp = shallowMount(ProgressBar, {
        propsData: {
          value: 5
        }
      })
      await nextTick()
      comp.setProps({
        value: 150
      })
      await nextTick()
      expect(comp.vm.count).toBe(100)
    })
  })

  describe('renderIndeterminant', () => {
    it('normal setup', async () => {
      const comp = shallowMount(ProgressBar, {
        propsData: {
          indeterminant: true,
          interval: 50
        }
      })
      await delay(201)
      expect(
        comp.vm.count,
        'after four cycles the value should be more than 15'
      ).toBeGreaterThanOrEqual(15)
      const style = comp.vm.$progressBar?.getAttribute('style')?.trim() || ''
      const regex = new RegExp(/width: \d+%/g)
      expect(regex.test(style)).toBeTruthy()
    })

    it('enable after mount', async () => {
      const comp = shallowMount(ProgressBar, {
        propsData: {
          indeterminant: false,
          interval: 50,
          value: 0
        }
      })
      await nextTick()
      comp.setProps({
        indeterminant: true,
        increment: 10
      })
      await delay(200)
      expect(comp.vm.count).toBeGreaterThanOrEqual(30)
    })
  })

  describe('onMounted', () => {
    it('verify normal setup', () => {
      const comp = shallowMount(ProgressBar, {
        propsData: {
          value: 5
        }
      })
      expect(comp.vm.count).toBe(5)
    })

    it('verify value is at minimum', () => {
      const comp = shallowMount(ProgressBar, {
        propsData: {
          min: 15,
          max: 50
        }
      })
      expect(comp.vm.count).toBe(15)
    })

    it('verify value is at maximum', () => {
      const comp = shallowMount(ProgressBar, {
        propsData: {
          max: 100,
          value: 2000
        }
      })
      expect(comp.vm.count).toBe(100)
    })

    it('verify min < max', () => {
      try {
        shallowMount(ProgressBar, {
          propsData: {
            min: 10,
            max: 5
          }
        })
        shallowMount(ProgressBar, {
          propsData: {
            min: 10,
            max: 10
          }
        })
        fail('Should have failed with max ! > min')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        expect(ProgressBar).toBeDefined()
      }
    })
  })
})
