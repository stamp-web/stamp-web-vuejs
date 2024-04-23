<script lang="ts" setup>
  import { stampCollectionStore } from '@/stores/stampCollectionStore'

  const store = stampCollectionStore()

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'stampCollectionRef' },
    rules: String
  })

  const getStampCollections = async (query: string) => {
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
    :name="$props.name || 'stampCollectionRef'"
    :native="false"
    :search="$props.search || true"
    :filter-results="true"
    label-prop="name"
    value-prop="id"
    :can-deselect="false"
    :append-to-body="true"
    :items="getStampCollections"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
