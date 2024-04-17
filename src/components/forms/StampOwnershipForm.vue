<script lang="ts" setup>
  import { useI18n } from 'vue-i18n'
  import { ref, watch } from 'vue'
  import AlbumSelector from '@/components/inputs/AlbumSelector.vue'
  import ConditionSelector from '@/components/inputs/ConditionSelector.vue'
  import GradeSelector from '@/components/inputs/GradeSelector.vue'
  import CurrencySelector from '@/components/inputs/CurrencySelector.vue'
  import { uuidv4 } from '@/util/object-utils'
  import type { Ownership } from '@/models/Owernship'

  const { t } = useI18n()

  const form$ = ref()

  const model = defineModel<Ownership>()

  const $emit = defineEmits(['validation-changed'])

  watch(
    () => [form$.value?.invalid],
    () => {
      $emit('validation-changed', !form$.value?.invalid)
    }
  )
</script>
<template>
  <div class="w-full border-gray-300 p-3 border-solid border rounded">
    <h3 class="text-[var(--vf-primary)]">{{ t('titles.ownership-details') }}</h3>
    <Vueform v-model="model" ref="form$" sync size="sm">
      <GroupElement name="group-stamp-ownership">
        <AlbumSelector v-model="model" :label="t('form.album')"></AlbumSelector>
        <ConditionSelector
          v-model="model"
          name="condition"
          :label="t('form.condition')"
          :columns="{ container: 12, label: 12, wrapper: 8 }"
        ></ConditionSelector>
        <GradeSelector
          v-model="model"
          name="grade"
          :label="t('form.grade')"
          :columns="{ container: 12, label: 12, wrapper: 8 }"
        ></GradeSelector>
        <CurrencySelector
          v-model="model"
          :columns="{ container: 12, label: 12, wrapper: 4 }"
        ></CurrencySelector>
        <TextareaElement
          :label="t('form.notes')"
          v-model="model"
          name="notes"
          rules="max:500"
          :autocomplete="uuidv4()"
        ></TextareaElement>
      </GroupElement>
    </Vueform>
  </div>
</template>
