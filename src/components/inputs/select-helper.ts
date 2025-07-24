import { nextTick } from 'vue'
import type { SelectElement } from '@vueform/vueform'

type SelectElementInput = HTMLDivElement & {
  dropdown: HTMLElement
}

export type SelectElementInstance = SelectElement & {
  data: Record<string, unknown>
  items: Array<{
    name: string
    [key: string]: unknown
  }>
}

export async function scrollOnOpen(
  instance: SelectElementInstance | undefined,
  name: string,
  prop = 'id'
) {
  if (instance && instance.items) {
    const option = instance.items.find((o) => o[prop] === instance.data[name])
    if (option) {
      const values = Array.from(
        (instance.input as SelectElementInput).dropdown.querySelectorAll('span')
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
