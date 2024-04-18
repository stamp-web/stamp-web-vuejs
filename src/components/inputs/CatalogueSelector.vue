<script lang="ts" setup>
  import { catalogueStore } from '@/stores/catalogueStore'

  const cataloguesStore = catalogueStore()

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'catalogueRef' },
    rules: String
  })

  const getCatalogues = async (query: string) => {
    let params = cataloguesStore.baseSearchOptions
    if (query) {
      // @ts-ignore
      params.$filter = `(contains(name,'${query}'))`
    }
    return await cataloguesStore.find(params)
  }
</script>
<template>
  <select-element
    :name="$props.name || 'catalogueRef'"
    :native="false"
    :search="$props.search || true"
    :filter-results="true"
    label-prop="name"
    value-prop="id"
    :can-deselect="false"
    :append-to-body="true"
    :items="getCatalogues"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete=""
  ></select-element>
</template>
