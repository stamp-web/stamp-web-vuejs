<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import type { Stamp } from '@/models/Stamp'
  import CountrySelector from '@/components/inputs/CountrySelector.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const form$ = ref()

  const model = defineModel<Stamp>()

  const $emit = defineEmits(['validation-changed'])

  watch(
    () => [form$.value?.invalid],
    () => {
      $emit('validation-changed', !form$.value?.invalid)
    }
  )
</script>
<template>
  <div class="border-gray-300 p-3 border-solid border rounded">
    <h3 class="text-[var(--vf-primary)]">{{ t('titles.details') }}</h3>
    <Vueform v-model="model" ref="form$" sync size="sm">
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
          class="!text-xs"
          rules="required|max:25"
          autocomplete="rate"
        ></TextElement>
        <TextElement
          :label="t('form.description')"
          v-model="model"
          name="description"
          rules="required|max:250"
          autocomplete="description"
        ></TextElement>
      </GroupElement>
    </Vueform>
  </div>
</template>
