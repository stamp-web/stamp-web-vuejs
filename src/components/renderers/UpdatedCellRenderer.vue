<script setup lang="ts">

type CellParams = {
    data: Record<string, unknown>
    path?: string
  }
  const props = defineProps<{
    params?: CellParams
  }>()

  const getIcon = () => {
    const updated = props.params?.data?.updated
    return updated ? 'sw-icon-ok' : 'sw-icon-time'
  }
</script>

<template>
  <span :class="`icon-cell ${getIcon()} flex items-center h-4 w-4 mt-2`"></span>
</template>
<style>
  .icon-cell::before {
    margin-left: 0.25rem;
  }

  .icon-cell.sw-icon-ok::before {
    color: #44c744;
  }
  .icon-cell.sw-icon-time::before {
    color: #b7b7b7;
  }
</style>
