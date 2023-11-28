<script setup lang="ts">
  import { computed } from 'vue'
  import { Condition } from '@/models/Condition'
  import { resolvePath } from '@/util/object-utils'

  const props = defineProps({
    params: Object as any
  })

  const condition = computed(() => {
    const value = +resolvePath(props.params?.data, props.params?.path, -1)
    let text = ''
    switch (value) {
      case Condition.MINT:
        text = 'Mint'
        break
      case Condition.MINT_NH:
        text = 'Mint (NH)'
        break
      case Condition.MINT_NG:
        text = 'Mint (No gum)'
        break
      case Condition.MINT_HH:
        text = 'Mint (heavily hinged)'
        break
      case Condition.CTO:
        text = 'Cancel to Order'
        break
      case Condition.USED:
        text = 'Used'
        break
      case Condition.COVER:
        text = 'Used on Cover'
        break
      case Condition.MANUSCRIPT:
        text = 'Manuscript Cancel'
        break
      case Condition.ON_PAPER:
        text = 'Used on Paper'
        break
    }
    return text
  })
</script>

<template>
  <span>{{ condition }}</span>
</template>
