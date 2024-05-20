<script lang="ts" setup>
  import { ref, watch, onMounted, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CatalogueSelector from '@/components/inputs/CatalogueSelector.vue'
  import ConditionSelector from '@/components/inputs/ConditionSelector.vue'
  import type { CatalogueNumber } from '@/models/CatalogueNumber'
  import { CurrencyCode, CurrencyTools } from '@/models/CurrencyCode'
  import { catalogueStore } from '@/stores/catalogueStore'
  import { type Catalogue, CatalogueModelHelper } from '@/models/Catalogue'

  const { t } = useI18n()
  const form$ = ref()
  const cvNumber = ref()

  const model = defineModel<CatalogueNumber>()
  const cataloguesStore = catalogueStore()

  const $props = defineProps({
    exists: { type: Boolean, default: false },
    autoTab: { type: Boolean, default: false }
  })
  const $emit = defineEmits([
    'validation-changed',
    'catalogue-prefix',
    'check-existence',
    'catalogueNumber-info-changed'
  ])
  const state = ref({
    currencyRegex: `regex:${CurrencyTools.formatRegex(CurrencyCode.USD, false)}`,
    currency: CurrencyCode.USD
  })

  const audio = ref<HTMLAudioElement>()

  watch(
    () => [form$.value?.invalid],
    () => {
      $emit('validation-changed', !form$.value?.invalid)
    }
  )

  watch(
    () => [$props.autoTab],
    () => {
      if ($props.autoTab) {
        cvNumber.value.focus()
      }
    }
  )

  watch(
    () => [$props.exists],
    () => {
      if ($props.exists) {
        audio.value?.play()
      }
    }
  )

  watch(
    () => [model.value?.condition, model.value?.number],
    (newVal, oldVal) => {
      newVal.forEach((item, idx) => {
        // we only want to emit the event if there was a change in the values we are watching
        if (item !== oldVal[idx]) {
          $emit('catalogueNumber-info-changed')
          $emit('check-existence')
          return false
        }
      })
    },
    {
      flush: 'post'
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
        $emit('catalogue-prefix', CatalogueModelHelper.getPrefix(catalogue))
        $emit('check-existence')
      }
    },
    {
      flush: 'post'
    }
  )

  onMounted(async () => {
    await nextTick()
    await form$.value.validate()
  })
</script>
<template>
  <div class="w-full border-gray-300 p-3 border-solid border rounded">
    <h3 class="text-[var(--vf-primary)] mb-1 font-bold">
      {{ t('titles.active-catalogueNumber') }}
    </h3>
    <Vueform v-model="model" ref="form$" sync size="sm" :display-errors="false">
      <GroupElement name="group-cn-details">
        <HiddenElement :meta="true" name="id" />
        <HiddenElement :meta="true" name="active" />
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
        <GroupElement
          :label="t('form.number')"
          name="group-number"
          :columns="{ container: 12, label: 12, wrapper: 12 }"
        >
          <TextElement
            v-model="model"
            name="number"
            ref="cvNumber"
            :columns="{ default: 6 }"
            rules="required|max:25"
            autocomplete="off"
            :add-classes="{
              ElementError: {
                container: 'text-nowrap'
              }
            }"
          ></TextElement>
          <span v-if="$props.exists" class="flex items-top mt-2 text-orange-300"
            ><i
              id="conflict-icon"
              class="sw-icon-attention"
              v-tooltip="t('messages.stamp-exists')"
            ></i
          ></span>
          <audio ref="audio" hidden="true">
            <!-- <source src="../../assets/sound/ring.ogg" type="audio/ogg" /> -->
            <source src="../../assets/sound/wrong-answer.mp3" type="audio/mpeg" />
          </audio>
        </GroupElement>

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
            :rules="`nullable|${state.currencyRegex}`"
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
