<script lang="ts" setup>
  import { computed, onBeforeMount, ref } from 'vue'
  import { sellerStore } from '@/stores/sellerStore'
  import type { Seller } from '@/models/entityModels'
  import type { SelectElement } from '@vueform/vueform'
  import { scrollOnOpen } from '@/components/inputs/select-helper'

  const store = sellerStore()
  const items = ref(new Array<Seller>())

  const $props = defineProps({
    label: String,
    search: Boolean,
    name: String,
    rules: String
  })

  const propName = computed(() => {
    return $props.name || 'sellerRef'
  })
  const onOpen = async (instance: SelectElement) => {
    scrollOnOpen(instance, propName.value)
  }

  onBeforeMount(async () => {
    items.value = await store.find()
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
    :can-deselect="false"
    :append-to-body="true"
    :items="items"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
    @open="onOpen"
  ></select-element>
</template>
