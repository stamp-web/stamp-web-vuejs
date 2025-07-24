<script setup lang="ts">
  import { computed } from 'vue'
  import type { Stamp } from '@/models/Stamp'
  import type { CellRendererParameters } from '@/components/renderers/types/cellRendererParameters'

  const props = defineProps<{
    params?: CellRendererParameters
    stamp: Stamp
  }>()

  const stampDescription = computed(() => {
    return buildStampName(props.stamp ? props.stamp : (props.params?.data as Stamp))
  })

  const buildStampName = (stamp: Stamp) => {
    return stamp ? `${stamp.rate ?? ''} ${stamp.description ?? ''}`.trim() : ''
  }
</script>

<template>
  <span>{{ stampDescription }}</span>
</template>
