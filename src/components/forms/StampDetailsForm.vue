<script lang="ts" setup>
  import { nextTick, onMounted, ref, watch } from 'vue'
  import type { Stamp } from '@/models/Stamp'
  import type { Country } from '@/models/entityModels'
  import CountrySelector from '@/components/inputs/CountrySelector.vue'
  import { useI18n } from 'vue-i18n'
  import { countryStore } from '@/stores/countryStore'

  const { t } = useI18n()

  const form$ = ref()
  const rateEl = ref()
  const countries = ref()

  const model = defineModel<Stamp>()
  const $emit = defineEmits([
    'validation-changed',
    'country-updated',
    'check-existence',
    'tab-forward'
  ])

  watch(
    () => [form$.value?.invalid],
    () => {
      $emit('validation-changed', !form$.value?.invalid)
    }
  )

  watch(
    () => model.value?.rate,
    async () => {
      await nextTick()
      focusRate()
    }
  )
  watch(
    () => model.value?.countryRef,
    async () => {
      if (!countries.value) {
        countries.value = countryStore()
      }
      const list: Array<Country> = await countries.value.find()
      const country = list.find((c) => {
        return c.id === model?.value?.countryRef
      })
      if (country) {
        $emit('country-updated', country.name)
        $emit('check-existence')
      }
    },
    {
      flush: 'post'
    }
  )

  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Tab' && model.value && (model.value.id < 1 || !model.value.id)) {
      $emit('tab-forward')
    }
  }

  const focusRate = () => {
    if (
      model.value &&
      (model.value.id < 1 || !model.value.id) &&
      (model.value.rate === '' || !model.value.rate) &&
      rateEl.value
    ) {
      rateEl.value.focus()
    }
  }

  onMounted(async () => {
    await nextTick()
    if (form$.value && form$.value.validate) {
      await form$.value.validate()
    }
    focusRate()
  })

  defineExpose({ onKeyDown })
</script>
<template>
  <div class="border-gray-300 p-3 border-solid border rounded">
    <h3 class="text-[var(--vf-primary)] mb-1 font-bold">{{ t('titles.details') }}</h3>
    <Vueform v-model="model" ref="form$" sync size="sm" :display-errors="false">
      <HiddenElement :meta="true" name="id" />
      <HiddenElement :meta="true" name="wantList" />
      <GroupElement name="group-stamp-details">
        <CountrySelector
          v-model="model"
          :label="t('form.country')"
          rules="required"
        ></CountrySelector>
        <TextElement
          :columns="{ container: 12, label: 12, wrapper: 5 }"
          :label="t('form.rate')"
          v-model="model"
          name="rate"
          ref="rateEl"
          rules="required|max:25"
          autocomplete="off"
        ></TextElement>
        <TextElement
          :label="t('form.description')"
          v-model="model"
          name="description"
          rules="required|max:250"
          @keydown="onKeyDown"
          autocomplete="off"
        ></TextElement>
      </GroupElement>
    </Vueform>
  </div>
</template>
