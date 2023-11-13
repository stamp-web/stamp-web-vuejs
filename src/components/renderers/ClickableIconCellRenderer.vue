<script setup lang="ts">
import { ref } from 'vue'

import type { KeyIndexable } from '@/util/ts/key-accessor'

const props = defineProps({
  params: Object as any
})

const callback = ref(props.params.callback)
const icon = ref(props.params.icon)

const handleClick = () => {
  if (!callback.value) {
    console.log('no callback was specified')
    return
  }
  const context: any = props.params.context
  if (context && context.component) {
    const component: Object = context.component
    const fn: Function = (component as KeyIndexable)[callback.value]
    if (fn) {
      const node = props.params.node
      fn.call(this, node.data, node.rowIndex)
    }
  }
}
</script>

<template>
  <span
    :class="`${icon} flex items-center h-6 w-6 hover:text-[var(--vf-primary-darker)] hover:border hover:bg-gray-100 hover:rounded-xl hover:border-current`"
    @click="handleClick()"
  ></span>
</template>

<style scoped></style>
