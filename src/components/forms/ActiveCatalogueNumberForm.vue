<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CatalogueSelector from '@/components/inputs/CatalogueSelector.vue'
  import ConditionSelector from '@/components/inputs/ConditionSelector.vue'

  const { t } = useI18n()
  const form$ = ref()

  const model = defineModel()

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
    <h3 class="text-[var(--vf-primary)]">{{ t('titles.active-catalogueNumber') }}</h3>
    <Vueform v-model="model" ref="form$" sync size="sm">
      <GroupElement name="group-cn-details">
        <CatalogueSelector
          v-model="model"
          :label="t('form.catalogue')"
          rules="required"
        ></CatalogueSelector>
        <ConditionSelector
          v-model="model"
          :label="t('form.condition')"
          :columns="{ container: 12, label: 12, wrapper: 8 }"
        ></ConditionSelector>
        <TextElement
          v-model="model"
          name="number"
          :columns="{ container: 12, label: 12, wrapper: 6 }"
          :label="t('form.number')"
          rules="required|max:25"
          :autocomplete="'num-' + Math.random()"
        ></TextElement>
        <TextElement
          v-model="model"
          name="value"
          :columns="{ container: 12, label: 12, wrapper: 4 }"
          :label="t('form.value')"
          rules=""
          :autocomplete="'num-' + Math.random()"
        ></TextElement>
        <CheckboxElement v-model="model" name="unknown">{{
          t('form.no-value-listed')
        }}</CheckboxElement>
        <CheckboxElement v-model="model" name="nospace">{{ t('form.no-space') }}</CheckboxElement>
      </GroupElement>
    </Vueform>
  </div>
</template>
