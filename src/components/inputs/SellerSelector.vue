<script lang="ts" setup>
  import { sellerStore } from '@/stores/sellerStore'

  const store = sellerStore()

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'sellerRef' },
    rules: String
  })

  const getSellers = async (query: string) => {
    let params = store.baseSearchOptions
    if (query) {
      // @ts-ignore
      params.$filter = `(contains(name,'${query}'))`
    }
    return await store.find(params)
  }
</script>
<template>
  <select-element
    :name="$props.name || 'sellerRef'"
    :native="false"
    :search="$props.search || false"
    :filter-results="false"
    label-prop="name"
    value-prop="id"
    :can-deselect="false"
    :append-to-body="true"
    :items="getSellers"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
