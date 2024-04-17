<script lang="ts" setup>
  import { catalogueStore } from '@/stores/catalogueStore'
  import { uuidv4 } from '@/util/object-utils'

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
    :search="$props.search || false"
    :filter-results="false"
    label-prop="name"
    value-prop="id"
    :can-deselect="false"
    :append-to-body="true"
    :items="getCatalogues"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    :autocomplete="uuidv4()"
  ></select-element>
</template>
