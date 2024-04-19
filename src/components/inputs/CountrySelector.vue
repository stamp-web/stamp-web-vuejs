<script lang="ts" setup>
  import { countryStore } from '@/stores/countryStore'

  const countriesStore = countryStore()

  const model = defineModel()

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
    :search="$props.search || true"
    :filter-results="true"
    label-prop="name"
    v-model="model"
    value-prop="id"
    :append-to-body="true"
    :can-deselect="false"
    :items="getCountries"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
