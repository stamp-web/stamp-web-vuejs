<script setup lang="ts">
  import { ref } from 'vue'

  interface GridNode<T = Record<string, unknown>> {
    data: T
    rowIndex: number
  }

  interface CellRendererParams {
    callbackFn?: (data: Record<string, unknown>, rowIndex: number) => void
    icon: string
    tooltip?: string
    node: GridNode
  }

  const props = defineProps<{
    params: CellRendererParams
  }>()

  const callback = ref(props.params.callbackFn)
  const icon = ref(props.params.icon)
  const tooltip = props.params.tooltip ?? null

  const handleClick = () => {
    const node = props.params.node
    if (callback.value) {
      callback.value(node.data, node.rowIndex)
    }
  }
</script>

<template>
  <span
    v-tooltip="tooltip"
    :class="`icon-cell ${icon} flex items-center h-6 w-6 hover:text-[var(--vf-primary-darker)] hover:border hover:bg-gray-100 hover:rounded-xl hover:border-current`"
    @click.stop="handleClick()"
  ></span>
</template>

<style scoped>
  .icon-cell::before {
    margin-left: 0.25rem;
  }
</style>
