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
  import { PredicateUtilities } from '@/util/predicate-util'
  import DateRangePicker from '@/components/inputs/DateRangePicker.vue'
  import { parseDateString, toISOString } from '@/util/date-utils'

  const { t } = useI18n()

  const form$ = ref()

  type Props = {
    criteria?: Predicate
    close?: () => void
  }

  type SearchFormModel = {
    purchased?: string[]
    createTimestamp?: string[]
    updateTimestamp?: string[]
    countryRef?: number
    stampCollectionRef?: number
    albumRef?: number
    catalogueRef?: number
    sellerRef?: number
    [key: string]: unknown
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'search-options': [searchParam: Predicate]
  }>()

  const model = ref<SearchFormModel>({})

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
    const predicates = new Array<Predicate>()
    const keys = Object.keys(model.value)
    const m = model.value as SearchFormModel
    keys.forEach((key) => {
      const value = m[key]
      if (value) {
        if (typeof value === 'object' && dateKeys.includes(key)) {
          processDatePredicates(predicates, value as string[], key)
        } else {
          predicates.push(
            new Predicate({
              subject: key,
              operator: Operators.EQUALS,
              value: value
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
    emit('search-options', searchParam)
    close()
  }
  const close = () => {
    if (props.close) {
      props.close()
    }
  }

  const hasContent = () => {
    const keys = Object.keys(model.value)
    const m = model.value as SearchFormModel

    return !keys.some((key) => {
      const val = m[key]
      if (!val) return false

      if (Array.isArray(val)) {
        // Check if array has any non-empty values
        return val.length > 0
      }

      if (typeof val === 'number') {
        return val > 0
      }

      return false
    })
  }

  function processParameters() {
    if (!props.criteria) return

    const predicates = (props.criteria as unknown as { flatten(): Predicate[] }).flatten()

    const modelKeys = Object.keys(model.value)
    predicates.forEach((p: Predicate) => {
      const key = p.subject
      if (modelKeys.includes(key)) {
        if (dateKeys.includes(key)) {
          const value = typeof p.value === 'string' ? p.value : String(p.value)
          const d = parseDateString(value)
          if (!Array.isArray(model.value[key])) {
            model.value[key] = new Array<Date>(2)
          }
          const index = p.operator === Operators.GREATER_THAN_EQUAL ? 0 : 1
          if (d) {
            const dates = model.value[key] as Date[]
            dates[index] = d
          }
        } else {
          model.value[key] = p.value
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
