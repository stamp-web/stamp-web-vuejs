<script lang="ts" setup>
  import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import StampCollectionSelector from '@/components/inputs/StampCollectionSelector.vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import CatalogueSelector from '@/components/inputs/CatalogueSelector.vue'
  import ConditionSelector from '@/components/inputs/ConditionSelector.vue'
  import AlbumSelector from '@/components/inputs/AlbumSelector.vue'
  import SellerSelector from '@/components/inputs/SellerSelector.vue'
  import GradeSelector from '@/components/inputs/GradeSelector.vue'
  import CountrySelector from '@/components/inputs/CountrySelector.vue'
  import CurrencySelector from '@/components/inputs/CurrencySelector.vue'
  import { preferenceStore } from '@/stores/PreferenceStore'
  import type { Preference } from '@/models/Preference'
  import type { KeyIndexable } from '@/util/ts/key-accessor'
  import { debounce } from '@/util/timer-utils'

  const { t } = useI18n()

  const form$ = ref()
  const saving = ref(false)
  const showMessage = ref(false)

  const model = ref({
    countryRef: null,
    albumRef: null,
    stampCollectionRef: null,
    catalogueRef: null,
    sellerRef: null,
    code: null,
    condition: null,
    grade: null
  })

  const prefStore = preferenceStore()

  const invalid = computed(() => {
    return form$.value?.invalid || saving.value
  })

  const savePreferences = async () => {
    saving.value = true
    Object.keys(model.value).forEach(async (key) => {
      const pref: Preference = await prefStore.findByNameAndCategory(key, 'stamps')
      const v = (model.value as KeyIndexable)[key]
      const value = v ? v.toString() : null
      if (pref && pref.value !== value) {
        pref.value = value
        await prefStore.update(pref)
      }
    })
    showMessage.value = true

    debounce(() => {
      saving.value = false
      showMessage.value = false
    }, 1000)
  }

  const preprocessPreferences = (prefs: Array<Preference>) => {
    Object.keys(model.value).forEach((key) => {
      const p = prefs.find((pref) => {
        return pref.name === key && pref.category === 'stamps'
      })
      if (p && p.value) {
        if (key.endsWith('Ref') || key === 'grade' || key === 'condition') {
          ;(model.value as KeyIndexable)[key] = Number.parseInt(p.value)
        } else {
          ;(model.value as KeyIndexable)[key] = p.value
        }
      }
    })
  }

  onBeforeMount(async () => {
    const prefs: Array<Preference> = await prefStore.find()
    preprocessPreferences(prefs)
  })

  onMounted(async () => {
    await nextTick()
    if (form$.value.el$) {
      form$.value.validate()
    }
  })

  defineExpose({ savePreferences, preprocessPreferences })
</script>
<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row overflow-y-hidden">
    <div class="flex-grow flex-auto flex flex-col overflow-y-auto">
      <div
        class="w-96 ml-auto mr-auto mt-4 h-full bg-white flex-shrink flex-auto flew-grow"
        role="form"
      >
        <h3 class="text-[var(--vf-primary)] mb-1 font-bold">{{ t('titles.editing-defaults') }}</h3>
        <Vueform
          size="sm"
          ref="form$"
          :model-value="model"
          sync
          class="m-2 w-full overflow-auto"
          :endpoint="false"
        >
          <CountrySelector v-model="model" :label="t('form.country')"></CountrySelector>
          <AlbumSelector v-model="model" :label="t('form.album')"></AlbumSelector>
          <StampCollectionSelector
            name="stampCollectionRef"
            :label="t('form.stampCollection')"
          ></StampCollectionSelector>
          <CatalogueSelector v-model="model" :label="t('form.catalogue')"></CatalogueSelector>
          <SellerSelector v-model="model" :label="t('form.seller')"></SellerSelector>
          <ConditionSelector
            v-model="model"
            :label="t('form.condition')"
            :columns="{ container: 12, label: 12, wrapper: 7 }"
          ></ConditionSelector>
          <GradeSelector
            v-model="model"
            name="grade"
            :label="t('form.grade')"
            :columns="{ container: 12, label: 12, wrapper: 7 }"
          ></GradeSelector>
          <CurrencySelector
            :label="t('form.currency')"
            v-model="model"
            :columns="{ default: 4 }"
          ></CurrencySelector>
        </Vueform>
        <div class="mt-auto ml-auto mb-2 flex flex-row items-center">
          <span :class="`ml-auto mr-4 align-middle ${!showMessage ? 'hidden' : ''}`">{{
            t('messages.saved')
          }}</span>
          <PrimaryButton
            :class="`${!showMessage ? 'ml-auto' : ''} mr-2`"
            :disabled="invalid"
            @click="savePreferences()"
            >{{ t('actions.save') }}</PrimaryButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
