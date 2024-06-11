import { nextTick } from 'vue'
import type { SelectElement } from '@vueform/vueform'

export async function scrollOnOpen(instance: SelectElement, name: string, prop = 'id') {
  if (instance && instance.items) {
    const option = (instance.items as Array<any>).find((o: any) => {
      // @ts-ignore
      return o[prop] === instance.data[name]
    })
    if (option) {
      const values: Array<HTMLElement> = Array.from(
        // @ts-ignore
        instance.input.dropdown.querySelectorAll('span')
      )
      if (values) {
        const v = values.find((val: HTMLElement) => {
          return option.name === val.innerText
        })
        if (v) {
          await nextTick()
          v.scrollIntoView(true)
        }
      }
    }
  }
}
