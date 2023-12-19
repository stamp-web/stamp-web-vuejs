<script setup lang="ts">
  import { computed } from 'vue'
  import type { Stamp } from '@/models/Stamp'

  const props = defineProps({
    params: Object as any,
    stamp: Object as any
  })

  const stampDescription = computed(() => {
    return buildStampName(props.stamp ? props.stamp : props.params?.data)
  })

  const buildStampName = (stamp: Stamp) => {
    return stamp ? `${stamp.rate ?? ''} ${stamp.description ?? ''}`.trim() : ''
  }
</script>

<template>
  <span>{{ stampDescription }}</span>
</template>
