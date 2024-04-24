<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { countryStore } from '@/stores/countryStore'
  import type { Country } from '@/models/entityModels'

  const countriesStore = countryStore()

  const model = defineModel()
  const items = ref(new Array<Country>())

  const $props = defineProps({
    label: String,
    search: Boolean,
    name: String,
    rules: String
  })

  onBeforeMount(async () => {
    items.value = await countriesStore.find()
  })
</script>
<template>
  <select-element
    :name="$props.name || 'countryRef'"
    :native="false"
    :search="$props.search || true"
    :track-by="['name']"
    :filter-results="true"
    label-prop="name"
    value-prop="id"
    v-model="model"
    :append-to-body="true"
    :items="items"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
