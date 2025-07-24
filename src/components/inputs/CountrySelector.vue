<script lang="ts" setup>
  import { computed, onBeforeMount, ref } from 'vue'
  import { countryStore } from '@/stores/countryStore'
  import type { Country } from '@/models/entityModels'
  import type { SelectElement } from '@vueform/vueform'
  import { scrollOnOpen, type SelectElementInstance } from '@/components/inputs/select-helper'

  const countriesStore = countryStore()

  const model = defineModel()
  const items = ref(new Array<Country>())

  const $props = defineProps({
    label: String,
    search: Boolean,
    name: String,
    rules: String
  })

  const propName = computed((): string => {
    return $props.name || 'countryRef'
  })
  const onOpen = async (instance: SelectElementInstance) => {
    scrollOnOpen(instance, propName.value)
  }

  onBeforeMount(async () => {
    items.value = await countriesStore.find()
  })
</script>
<template>
  <select-element
    :name="propName"
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
    @open="onOpen"
    autocomplete="off"
  ></select-element>
</template>
