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
  import { preferenceStore } from '@/stores/preferenceStore'
  import type { Preference } from '@/models/Preference'
  import type { KeyIndexable } from '@/util/ts/key-accessor'
import LocaleUtilities from '@/util/locale-utils'

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
    grade: null,
    locale: null
  })

  const prefStore = preferenceStore()

  const invalid = computed(() => {
    return form$.value?.invalid || saving.value
  })

  const changeLocaleNow = () => {
    const selectedLocale = model.value.locale
    if (selectedLocale === 'en-US' || selectedLocale === 'de') {
      LocaleUtilities.setLocale(selectedLocale)
    }
  }

  const savePreferences = async () => {
    saving.value = true
    const keys = Object.keys(model.value)
    for (const key of keys) {
      const isLocale = key === 'locale'
      const category = isLocale ? 'user' : 'stamps'
      const pref: Preference = await prefStore.findByNameAndCategory(key, category)
      const v = (model.value as KeyIndexable)[key]
      const value = v ? v.toString() : undefined
      if (pref) {
        if (pref.value !== value) {
          pref.value = value
          await prefStore.update(pref)
        }
      } else if (value !== undefined && value !== null) {
        const newPref: Preference = {
          id: 0,
          name: key,
          category,
          value
        }
        await prefStore.create(newPref)
      }
      if (isLocale && value) {
        LocaleUtilities.setLocale(value as 'en-US' | 'de')
      }
    }
    showMessage.value = true

    setTimeout(() => {
      saving.value = false
      showMessage.value = false
    }, 1000)
  }

  const preprocessPreferences = (prefs: Array<Preference>) => {
    Object.keys(model.value).forEach((key) => {
      const isLocale = key === 'locale'
      const category = isLocale ? 'user' : 'stamps'
      const p = prefs.find((pref) => {
        return pref.name === key && pref.category === category
      })
      if (p && p.value) {
        if (isLocale) {
          if (p.value === 'en-US' || p.value === 'de') {
            ;(model.value as KeyIndexable)[key] = p.value
            LocaleUtilities.setLocale(p.value as 'en-US' | 'de')
          }
        } else if (key.endsWith('Ref') || key === 'grade' || key === 'condition') {
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
    <div class="settings-view flex-grow flex-auto flex flex-col overflow-y-auto">
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
          <div class="col-span-12">
            <div class="w-7/12 flex items-end gap-2">
              <div class="flex-grow">
                <select-element
                  name="locale"
                  :label="t('form.language')"
                  :native="false"
                  :search="false"
                  label-prop="name"
                  value-prop="value"
                  :items="[
                    { value: 'en-US', name: t('languages.en-US') },
                    { value: 'de', name: t('languages.de') }
                  ]"
                  :columns="{ container: 12, label: 12, wrapper: 12 }"
                  :append-to-body="true"
                />
              </div>
              <button
                type="button"
                class="hover:text-[var(--vf-primary)] text-gray-400 focus:outline-none transition-colors mb-2.5 flex-shrink-0 mr-2"
                @click="changeLocaleNow"
                title="Change the language now"
                v-tooltip="'Change the language now'"
              >
                <span class="sw-icon-language scale-110"></span>
              </button>
            </div>
          </div>
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
<style>
  .settings-view .form-text-sm {
    font-size: var(--var-text-size-sm);
  }
</style>
