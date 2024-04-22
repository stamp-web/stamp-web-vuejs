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
  const countries = countryStore()
  const model = defineModel<Stamp>()
  const $emit = defineEmits(['validation-changed', 'country-updated'])

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
      const list: Array<Country> = await countries.find()
      const country = list.find((c) => {
        return c.id === model?.value?.countryRef
      })
      if (country) {
        $emit('country-updated', country.name)
      }
    },
    {
      flush: 'post'
    }
  )

  const focusRate = () => {
    if (
      model.value &&
      (model.value.id < 1 || !model.value.id) &&
      (model.value.rate === '' || !model.value.rate)
    ) {
      rateEl.value.focus()
    }
  }

  onMounted(async () => {
    await nextTick()
    await form$.value.validate()
    focusRate()
  })
</script>
<template>
  <div class="border-gray-300 p-3 border-solid border rounded">
    <h3 class="text-[var(--vf-primary)] mb-1 font-bold">{{ t('titles.details') }}</h3>
    <Vueform v-model="model" ref="form$" sync size="sm" :display-errors="false">
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
          autocomplete="off"
        ></TextElement>
      </GroupElement>
    </Vueform>
  </div>
</template>
