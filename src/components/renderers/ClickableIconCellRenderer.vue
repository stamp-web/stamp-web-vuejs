<script setup lang="ts">
  import { ref } from 'vue'

  import type { KeyIndexable } from '@/util/ts/key-accessor'

  const props = defineProps({
    params: Object as any
  })

  const callback = ref(props.params.callback)
  const icon = ref(props.params.icon)
  const tooltip = props.params.tooltip ? props.params.tooltip : null

  const handleClick = () => {
    const context: any = props.params.context
    const node = props.params.node
    let fn = undefined
    if (context && context.callbackFn && context.callbackFn instanceof Array) {
      // @ts-ignore
      fn = context.callbackFn.find((f) => {
        return f.name === callback.value
      })
    } else if (context && context.component) {
      /* Temporarily support older component pattern */
      const component: Object = context.component
      fn = (component as KeyIndexable)[callback.value]
    }
    if (fn) {
      fn.call(this, node.data, node.rowIndex)
    }
  }
</script>

<template>
  <span
    v-tooltip="tooltip"
    :class="`icon-cell ${icon} flex items-center h-6 w-6 hover:text-[var(--vf-primary-darker)] hover:border hover:bg-gray-100 hover:rounded-xl hover:border-current`"
    @click="handleClick()"
  ></span>
</template>

<style scoped>
  .icon-cell::before {
    margin-left: 0.25rem;
  }
</style>
