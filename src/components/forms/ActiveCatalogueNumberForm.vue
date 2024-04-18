<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CatalogueSelector from '@/components/inputs/CatalogueSelector.vue'
  import ConditionSelector from '@/components/inputs/ConditionSelector.vue'
  import type { CatalogueNumber } from '@/models/CatalogueNumber'
  import { CurrencyCode, CurrencyTools } from '@/models/CurrencyCode'
  import { catalogueStore } from '@/stores/catalogueStore'
  import type { Catalogue } from '@/models/entityModels'

  const { t } = useI18n()
  const form$ = ref()

  const model = defineModel<CatalogueNumber>()
  const cataloguesStore = catalogueStore()
  const $emit = defineEmits(['validation-changed'])
  const state = ref({
    currencyRegex: `regex:${CurrencyTools.formatRegex(CurrencyCode.USD, false)}`,
    currency: CurrencyCode.USD
  })

  watch(
    () => [form$.value?.invalid],
    () => {
      $emit('validation-changed', !form$.value?.invalid)
    }
  )

  watch(
    () => model.value?.catalogueRef,
    async () => {
      const catalogues: Array<Catalogue> = await cataloguesStore.find()
      const catalogue = catalogues.find((c) => {
        return c.id === model?.value?.catalogueRef
      })
      if (catalogue) {
        state.value.currencyRegex = `regex:${CurrencyTools.formatRegex(catalogue.code, false)}`
        state.value.currency = catalogue.code
      }
    },
    {}
  )
</script>
<template>
  <div class="w-full border-gray-300 p-3 border-solid border rounded">
    <h3 class="text-[var(--vf-primary)] mb-1 font-bold">
      {{ t('titles.active-catalogueNumber') }}
    </h3>
    <Vueform v-model="model" ref="form$" sync size="sm" :display-errors="false">
      <GroupElement name="group-cn-details">
        <CatalogueSelector
          v-model="model"
          :label="t('form.catalogue')"
          rules="required"
        ></CatalogueSelector>
        <ConditionSelector
          v-model="model"
          :label="t('form.condition')"
          :columns="{ container: 12, label: 12, wrapper: 7 }"
        ></ConditionSelector>
        <TextElement
          v-model="model"
          name="number"
          :columns="{ container: 12, label: 12, wrapper: 6 }"
          :label="t('form.number')"
          rules="required|max:25"
          autocomplete="off"
        ></TextElement>
        <GroupElement
          :label="t('form.value')"
          name="group-value"
          :columns="{ container: 12, label: 12, wrapper: 12 }"
        >
          <TextElement
            v-model="model"
            name="value"
            :disabled="model?.unknown || false"
            input-type="search"
            force-numbers
            :columns="{ default: 4 }"
            :rules="`${state.currencyRegex}`"
            :add-Classes="{
              ElementLayout: {
                innerWrapperAfter: 'relative w-48'
              },
              ElementError: {
                container: 'min-w-48'
              }
            }"
            autocomplete="off"
          ></TextElement>
          <div class="col-span-6 flex items-center text-xs h-8">({{ state.currency }})</div>
        </GroupElement>
        <CheckboxElement v-model="model" name="unknown">{{
          t('form.no-value-listed')
        }}</CheckboxElement>
        <CheckboxElement v-model="model" name="nospace">{{ t('form.no-space') }}</CheckboxElement>
      </GroupElement>
    </Vueform>
  </div>
</template>
