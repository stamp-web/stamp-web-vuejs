<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue'
  import { countryStore } from '@/stores/countryStore'
  import type { Country } from '@/models/entityModels'

  const store = countryStore()
  const countries = ref<Array<Country>>()
  const isEmbedded = ref(false)

  type CellParams = {
    value?: number
  }

  const props = defineProps<{
    params?: CellParams
    countryRef?: number
    embedded?: string
  }>()

  /**
   * Returns the computed country name from the given id of the country for the cell.
   */
  const countryName = computed(() => {
    const value = props.params ? props.params.value : props.countryRef
    return value ? findCountryName(value) : ''
  })

  const findCountryName = (value: number) => {
    let found
    if (countries.value) {
      found = countries.value.find((country: Country) => {
        return country.id === value
      })
    }
    return found ? found.name : ''
  }

  onBeforeMount(async () => {
    countries.value = await store.find()
    isEmbedded.value = new Boolean(props.embedded).valueOf()
  })
</script>

<template>
  <span
    :class="`overflow-hidden overflow-ellipsis ${isEmbedded ? 'contents' : 'block'}`"
    v-tooltip.top-start="countryName"
    >{{ countryName }}</span
  >
</template>
