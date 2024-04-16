<script lang="ts" setup>
  import { CurrencyCode } from '@/models/CurrencyCode'

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'code' },
    rules: String
  })

  const getCurrencies = async () => {
    const codes = new Array<any>()
    // @ts-ignore
    Object.keys(CurrencyCode).forEach((key) => {
      codes.push({ value: key, name: key })
    })
    return Promise.resolve(codes)
  }
</script>
<template>
  <select-element
    :name="$props.name || 'condition'"
    :native="false"
    :search="false"
    label-prop="name"
    value-prop="value"
    :items="getCurrencies"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
  ></select-element>
</template>
