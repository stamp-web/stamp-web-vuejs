<script lang="ts" setup>
  import { CurrencyCode } from '@/models/CurrencyCode'
  import type { ValueRecord } from '@/components/inputs/types/valueRecord'

  const $props = defineProps({
    value: String,
    appendToBody: Boolean,
    label: String,
    search: { type: Boolean, default: false },
    name: { type: String, default: 'code' },
    rules: String
  })

  const getCurrencies = async () => {
    const codes = new Array<ValueRecord<string>>()
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
    :default="$props.value"
    label-prop="name"
    value-prop="value"
    :items="getCurrencies"
    :append-to-body="$props.appendToBody || true"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
