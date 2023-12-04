<script setup lang="ts">
  import { computed } from 'vue'
  import { asCurrencyString, resolvePath } from '@/util/object-utils'
  import type { Ownership } from '@/models/Owernship'
  import { CurrencyCode } from '@/models/CurrencyCode'

  const props = defineProps({
    params: Object as any
  })

  const pricePaid = computed(() => {
    const ownership = resolvePath(props.params?.data, props.params?.path) as Ownership
    if (ownership) {
      const price = ownership.pricePaid ?? 0.0
      const currency = ownership.code ?? CurrencyCode.USD
      return asCurrencyString(price, currency)
    }
    return ''
  })
</script>

<template>
  <span>{{ pricePaid }}</span>
</template>
