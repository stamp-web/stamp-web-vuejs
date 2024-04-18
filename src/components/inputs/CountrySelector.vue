<script lang="ts" setup>
  import { countryStore } from '@/stores/countryStore'

  const countriesStore = countryStore()

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'countryRef' },
    rules: String
  })

  const getCountries = async (query: string) => {
    let params = countriesStore.baseSearchOptions
    if (query) {
      // @ts-ignore
      params.$filter = `(contains(name,'${query}'))`
    }
    return await countriesStore.find(params)
  }
</script>
<template>
  <select-element
    :name="$props.name || 'countryRef'"
    :native="false"
    :search="$props.search || false"
    :filter-results="false"
    label-prop="name"
    value-prop="id"
    :append-to-body="true"
    :can-deselect="false"
    :items="getCountries"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
