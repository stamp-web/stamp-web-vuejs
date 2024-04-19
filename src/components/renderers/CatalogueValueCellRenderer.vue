<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue'
  import { catalogueStore } from '@/stores/catalogueStore'
  import { type Stamp } from '@/models/Stamp'
  import { type CatalogueNumber } from '@/models/CatalogueNumber'
  import { type Catalogue } from '@/models/Catalogue'
  import { CurrencyTools } from '@/models/CurrencyCode'

  const store = catalogueStore()
  const catalogues = ref<Array<Catalogue>>()

  const props = defineProps({
    params: Object as any
  })

  const catalogueValue = computed(() => {
    const cn = (props.params.data as Stamp).activeCatalogueNumber as CatalogueNumber
    return buildCatalogueValue(cn)
  })

  const buildCatalogueValue = (cn: CatalogueNumber) => {
    if (catalogues.value && cn) {
      const catalogue = (catalogues.value as Array<Catalogue>).find((c: Catalogue) => {
        return c.id === cn.catalogueRef
      })
      if (catalogue) {
        const currency = catalogue.code
        return CurrencyTools.asCurrencyString(cn.value, currency)
      }
    }

    return '-'
  }

  onBeforeMount(async () => {
    catalogues.value = await store.find()
  })
</script>

<template>
  <span>{{ catalogueValue }}</span>
</template>
