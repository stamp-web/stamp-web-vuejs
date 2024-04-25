<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { resolvePath } from '@/util/object-utils'
  import { type Ownership } from '@/models/Ownership'
  import LocaleUtils from '@/util/locale-utils'

  const props = defineProps({
    params: Object as any,
    stamp: Object as any,
    path: String
  })

  const tooltip = ref(LocaleUtils.t('messages.cert-exists'))

  const certIcon = computed(() => {
    let icon = undefined
    if ((props.stamp && props.path) || (props.params?.data && props.params?.path)) {
      const obj = props.stamp ? props.stamp : props.params?.data
      const path = props.path ? props.path : props.params?.path
      const ownership = resolvePath(obj, path) as Ownership
      if (ownership && ownership.cert) icon = 'sw-icon-ribbon'
    }
    return icon
  })
</script>

<template>
  <VTooltip>
    <span v-if="certIcon" :class="`icon-cell ${certIcon} flex items-center h-4 w-4`"></span>
    <template #popper>
      <span v-if="certIcon" class="cert-tooltip" v-html="tooltip"></span>
    </template>
  </VTooltip>
</template>
<style>
  .cert-tooltip {
    display: block;
    max-width: 20rem;
  }

  .icon-cell::before {
    margin-left: 0.25rem;
  }

  .icon-cell.sw-icon-ribbon::before {
    color: var(--vf-primary);
  }
</style>
