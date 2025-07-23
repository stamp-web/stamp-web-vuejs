<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { onMounted, ref } from 'vue'
  import { Operators, Predicate } from 'odata-filter-parser'

  import CatalogueSelector from '@/components/inputs/CatalogueSelector.vue'
  import CountrySelector from '@/components/inputs/CountrySelector.vue'
  import StampCollectionSelector from '@/components/inputs/StampCollectionSelector.vue'
  import AlbumSelector from '@/components/inputs/AlbumSelector.vue'
  import SellerSelector from '@/components/inputs/SellerSelector.vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import type { KeyIndexable } from '@/util/ts/key-accessor'
  import { PredicateUtilities } from '@/util/predicate-util'
  import DateRangePicker from '@/components/inputs/DateRangePicker.vue'
  import { parseDateString, toISOString } from '@/util/date-utils'

  const { t } = useI18n()

  const form$ = ref()

  const $props = defineProps({
    criteria: Predicate,
    close: Function
  })

  const $emit = defineEmits(['search-options'])

  const model = ref({})

  const dateKeys = ['purchased', 'updateTimestamp', 'createTimestamp']

  function processDatePredicates(predicates: Array<Predicate>, arr: Array<string>, key: string) {
    if (arr.length > 1) {
      predicates.push(
        new Predicate({
          subject: key,
          operator: Operators.GREATER_THAN_EQUAL,
          value: `datetimeoffset'${toISOString(new Date(arr[0]))}'`
        })
      )
      predicates.push(
        new Predicate({
          subject: key,
          operator: Operators.LESS_THAN_EQUAL,
          value: `datetimeoffset'${toISOString(new Date(arr[1]))}'`
        })
      )
    }
  }

  function buildPredicates() {
    const predicates: Predicate[] = []
    const keys = Object.keys(model.value)
    keys.forEach((key) => {
      const entry = model.value as KeyIndexable
      if (entry[key]) {
        const value = entry[key]
        if (typeof value === 'object' && dateKeys.includes(key)) {
          processDatePredicates(predicates, value as Array<string>, key)
        } else {
          predicates.push(
            new Predicate({
              subject: key,
              operator: Operators.EQUALS,
              value: entry[key]
            })
          )
        }
      }
    })
    return predicates
  }

  const goSearch = () => {
    const predicates = buildPredicates()
    const searchParam = PredicateUtilities.concat(Operators.AND, predicates)
    $emit('search-options', searchParam)
    close()
  }
  const close = () => {
    if ($props.close) {
      // @ts-ignore
      $props.close()
    }
  }

  const hasContent = () => {
    const keys = Object.keys(model.value)
    let result = false
    keys.forEach((key) => {
      const val = (model.value as KeyIndexable)[key]
      if (typeof val === 'object' && val) {
        result = result || val.length > 0
      } else {
        result = result || val > 0
      }
    })
    return !result
  }

  function processParameters() {
    // @ts-ignore
    const predicates = $props.criteria.flatten()
    const modelKeys = Object.keys(model.value)
    predicates.forEach((p: Predicate) => {
      const key = p.subject
      if (modelKeys.includes(key)) {
        if (dateKeys.includes(key)) {
          const d = parseDateString(p.value)
          const m = model.value as KeyIndexable
          if (m[key].length === 0) {
            m[key] = new Array<Date>(2)
          }
          m[key][p.operator === Operators.GREATER_THAN_EQUAL ? 0 : 1] = d
        } else {
          ;(model.value as KeyIndexable)[key] = p.value
        }
      }
    })
  }

  onMounted(() => {
    processParameters()
  })
</script>
<template>
  <div class="flex w-full">
    <div class="overflow-y-auto mt-2 search-form h-[24rem] w-[22rem]">
      <Vueform ref="form$" name="search-form" size="sm" v-model="model" sync>
        <DateRangePicker
          :columns="{ container: 12, label: 4, wrapper: 12 }"
          name="purchased"
          :label="t('form.purchased')"
        ></DateRangePicker>
        <DateRangePicker
          :columns="{ container: 12, label: 4, wrapper: 12 }"
          name="createTimestamp"
          :label="t('form.created')"
        ></DateRangePicker>
        <DateRangePicker
          :columns="{ container: 12, label: 4, wrapper: 12 }"
          name="updateTimestamp"
          :label="t('form.updated')"
        ></DateRangePicker>
        <CountrySelector
          name="countryRef"
          :label="t('form.country')"
          :columns="{ container: 12, label: 4, wrapper: 12 }"
        ></CountrySelector>
        <StampCollectionSelector
          name="stampCollectionRef"
          :label="t('form.stampCollection')"
          :columns="{ container: 12, label: 4, wrapper: 12 }"
        ></StampCollectionSelector>
        <AlbumSelector
          name="albumRef"
          :label="t('form.album')"
          :columns="{ container: 12, label: 4, wrapper: 12 }"
        ></AlbumSelector>
        <CatalogueSelector
          name="catalogueRef"
          :label="t('form.catalogue')"
          :columns="{ container: 12, label: 4, wrapper: 12 }"
        ></CatalogueSelector>
        <SellerSelector
          name="sellerRef"
          :label="t('form.seller')"
          :columns="{ container: 12, label: 4, wrapper: 12 }"
        ></SellerSelector>
      </Vueform>
    </div>
  </div>

  <div class="flex mb-2 mt-4">
    <PrimaryButton :disabled="hasContent()" class="ml-auto mr-1" @click="goSearch">{{
      t('actions.search')
    }}</PrimaryButton>
    <SecondaryButton @click="close">{{ t('actions.cancel') }}</SecondaryButton>
  </div>
</template>

<style>
  .search-form .form-text-sm {
    font-size: 12px;
  }
</style>
