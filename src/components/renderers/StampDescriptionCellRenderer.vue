<script setup lang="ts">
  import { computed } from 'vue'
  import type { Stamp } from '@/models/Stamp'

  const props = defineProps({
    params: Object as any
  })

  const stampDescription = computed(() => {
    return buildStampName(props.params.data)
  })

  const buildStampName = (stamp: Stamp) => {
    return `${stamp.rate} ${stamp.description}`
  }
</script>

<template>
  <span>{{ stampDescription }}</span>
</template>
