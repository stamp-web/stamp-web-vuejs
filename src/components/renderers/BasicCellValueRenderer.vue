<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
    params: Object as any,
    stamp: Object as any
  })

  const text = computed(() => {
    const params = props.params
    if (params && params.colDef) {
      const data = params.data
      if (data && params.colDef.colId) {
        return data[params.colDef.colId]
      }
    }
    return undefined
  })
</script>

<template>
  <span v-if="text" :class="`overflow-ellipsis overflow-hidden block`" v-tooltip.top="text">{{
    text
  }}</span>
</template>
