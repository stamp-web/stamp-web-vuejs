<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue'
  import { countryStore } from '@/stores/countryStore'
  import type { Country } from '@/models/entityModels'

  const store = countryStore()
  const countries = ref<Array<Country>>()

  const props = defineProps({
    params: Object as any,
    countryRef: Number
  })

  /**
   * Returns the computed country name from the given id of the country for the cell.
   */
  const countryName = computed(() => {
    const value =
      props.countryRef && props.countryRef > 0
        ? props.countryRef
        : props.params
          ? props.params.value
          : -1
    return findCountryName(value)
  })

  const findCountryName = (value: number) => {
    let found
    if (countries.value) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      found = countries.value.find((country: Country) => {
        return country.id === value
      })
    }
    return found ? found.name : ''
  }

  onBeforeMount(async () => {
    countries.value = await store.find()
  })
</script>

<template>
  <span>{{ countryName }}</span>
</template>
