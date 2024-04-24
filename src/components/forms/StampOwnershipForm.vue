<script lang="ts" setup>
  import { useI18n } from 'vue-i18n'
  import { ref, watch } from 'vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

  import AlbumSelector from '@/components/inputs/AlbumSelector.vue'
  import ConditionSelector from '@/components/inputs/ConditionSelector.vue'
  import GradeSelector from '@/components/inputs/GradeSelector.vue'
  import CurrencySelector from '@/components/inputs/CurrencySelector.vue'
  import SellerSelector from '@/components/inputs/SellerSelector.vue'
  import DatePickerElement from '@/components/inputs/DatePickerElement.vue'
  import EnumTotallingSelector from '@/components/inputs/EnumTotallingSelector.vue'
  import { type Ownership } from '@/models/Ownership'
  import { CurrencyCode, CurrencyTools } from '@/models/CurrencyCode'
  import { Defects } from '@/models/Defects'
  import { Deception } from '@/models/Deception'

  const { t } = useI18n()

  const form$ = ref()
  const state = ref({
    currencyRegex: `regex:${CurrencyTools.formatRegex(CurrencyCode.USD, false)}`
  })

  const model = defineModel<Ownership>()
  const defectEnum = Defects
  const deceptionEnum = Deception
  const $emit = defineEmits(['validation-changed', 'regenerate-image-path'])

  watch(
    () => [form$.value?.invalid],
    () => {
      $emit('validation-changed', !form$.value?.invalid)
    }
  )

  const regenerateImagePath = () => {
    if (model.value?.img) {
      $emit('regenerate-image-path')
    }
  }

  watch(
    () => model.value?.code,
    () => {
      state.value.currencyRegex = `regex:${CurrencyTools.formatRegex(model.value?.code || CurrencyCode.USD, false)}`
    }
  )

  defineExpose({ regenerateImagePath })
</script>
<template>
  <div class="w-full border-gray-300 p-3 border-solid border rounded">
    <h3 class="text-[var(--vf-primary)] mb-1 font-bold">{{ t('titles.ownership-details') }}</h3>
    <Vueform v-model="model" ref="form$" sync size="sm" :display-errors="false" :endpoint="false">
      <GroupElement name="group-stamp-ownership">
        <AlbumSelector v-model="model" :label="t('form.album')"></AlbumSelector>
        <ConditionSelector
          v-model="model"
          name="condition"
          :label="t('form.condition')"
          :columns="{ container: 12, label: 12, wrapper: 7 }"
        ></ConditionSelector>
        <GradeSelector
          v-model="model"
          name="grade"
          :label="t('form.grade')"
          :columns="{ container: 12, label: 12, wrapper: 7 }"
        ></GradeSelector>
        <SellerSelector v-model="model" :label="t('form.seller')"></SellerSelector>
        <EnumTotallingSelector
          :label="t('form.defects')"
          :type="defectEnum"
          token-name="defects"
        ></EnumTotallingSelector>
        <EnumTotallingSelector
          :label="t('form.deceptions')"
          :type="deceptionEnum"
          token-name="deception"
        ></EnumTotallingSelector>
        <DatePickerElement
          :label="t('form.purchased')"
          name="purchased"
          v-model="model"
          :columns="{ default: 6 }"
        ></DatePickerElement>
        <GroupElement
          name="group-price"
          :columns="{ container: 12, label: 12, wrapper: 12 }"
          :label="t('form.pricePaid')"
          ><TextElement
            v-model="model"
            name="pricePaid"
            :add-Classes="{
              ElementLayout: {
                innerWrapperAfter: 'relative w-48'
              },
              ElementError: {
                container: 'min-w-48'
              }
            }"
            input-type="search"
            force-numbers
            :columns="{ default: 4 }"
            :rules="`nullable|${state.currencyRegex}`"
            autocomplete="off"
          ></TextElement>
          <CurrencySelector v-model="model" :columns="{ default: 4 }"></CurrencySelector>
        </GroupElement>
        <GroupElement name="group-image-path">
          <TextElement
            :label="t('form.image-path')"
            v-model="model"
            name="img"
            rules="max:250"
            :columns="{ default: 10 }"
            autocomplete="off"
          ></TextElement>
          <SecondaryButton
            class="mr-2 !px-0.5 !py-0 max-h-6 min-h-6 mt-auto mb-1 w-6 max-w-6"
            :tooltip="t('form.regenerate-image')"
            @click="regenerateImagePath"
            icon="sw-icon-refresh"
          ></SecondaryButton>
        </GroupElement>

        <CheckboxElement v-model="model" name="cert">{{ t('form.certified') }}</CheckboxElement>
        <TextElement
          :label="t('form.certificate')"
          v-model="model"
          name="certImg"
          :disabled="!model?.cert"
          rules="max:250"
          autocomplete="off"
        ></TextElement>
        <TextareaElement
          :label="t('form.notes')"
          v-model="model"
          name="notes"
          rules="max:500"
          autocomplete="off"
        ></TextareaElement>
      </GroupElement>
    </Vueform>
  </div>
</template>
<style></style>
