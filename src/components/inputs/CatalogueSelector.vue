<script lang="ts" setup>
  import { computed, onBeforeMount, ref } from 'vue'
  import { catalogueStore } from '@/stores/catalogueStore'
  import type { Catalogue } from '@/models/Catalogue'
  import type { SelectElement } from '@vueform/vueform'
  import { scrollOnOpen, type SelectElementInstance } from '@/components/inputs/select-helper'

  const cataloguesStore = catalogueStore()
  const items = ref(new Array<Catalogue>())
  const model = defineModel()

  const $props = defineProps({
    label: String,
    search: Boolean,
    name: String,
    rules: String
  })

  const propName = computed((): string => {
    return $props.name || 'catalogueRef'
  })
  const onOpen = async (instance: SelectElementInstance) => {
    scrollOnOpen(instance, propName.value)
  }

  onBeforeMount(async () => {
    items.value = await cataloguesStore.find()
  })
</script>
<template>
  <select-element
    :name="propName"
    :native="false"
    :search="$props.search || true"
    :filter-results="true"
    label-prop="name"
    value-prop="id"
    v-model="model"
    :can-deselect="false"
    :append-to-body="true"
    :items="items"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
    @open="onOpen"
  ></select-element>
</template>
