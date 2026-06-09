<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stamp } from '@/models/Stamp'
import type { CatalogueNumber } from '@/models/CatalogueNumber'
import { CatalogueNumberHelper } from '@/models/CatalogueNumber'
import { CurrencyCode, CurrencyTools } from '@/models/CurrencyCode'
import { catalogueStore } from '@/stores/catalogueStore'
import { stampStore } from '@/stores/stampStore'
import type { Catalogue } from '@/models/Catalogue'
import CatalogueNumberService from '@/services/CatalogueNumberService'
import { Prompt } from '@/components/Prompt'
import { extractErrorMessage } from '@/util/object-utils'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import CatalogueSelector from '@/components/inputs/CatalogueSelector.vue'
import ConditionSelector from '@/components/inputs/ConditionSelector.vue'
import { ConditionHelper } from '@/models/Condition'

const { t } = useI18n()
  const cataloguesStore = catalogueStore()
  const stampsStore = stampStore()

  const props = defineProps<{ stamp: Stamp }>()
  const $emit = defineEmits(['close', 'stamp-updated'])

  const catalogues = ref<Catalogue[]>([])
  const editingCn = ref<CatalogueNumber | null>(null)
  const form$ = ref()
  const isFormValid = ref(true)
  const currencyRegex = ref(`regex:${CurrencyTools.formatRegex(CurrencyCode.USD, false)}`)

  onMounted(async () => {
    catalogues.value = await cataloguesStore.find()
  })

  const sortedCatalogueNumbers = computed(() => {
    if (!props.stamp?.catalogueNumbers) return []
    return [...props.stamp.catalogueNumbers].sort((a, b) => {
      if (a.active) return -1
      if (b.active) return 1
      return a.number.localeCompare(b.number)
    })
  })

  const getCatalogueName = (catalogueRef: number) => {
    const cat = catalogues.value.find((c) => c.id === catalogueRef)
    return cat ? `${cat.issue || ''} ${cat.name}` : `Catalogue #${catalogueRef}`
  }

  const getCatalogueCurrency = (catalogueRef: number | undefined) => {
    const cat = catalogues.value.find((c) => c.id === catalogueRef)
    return cat ? cat.code : 'USD'
  }

  watch(
    () => editingCn.value?.catalogueRef,
    () => {
      if (!editingCn.value) return
      const cat = catalogues.value.find((c) => c.id === editingCn.value?.catalogueRef)
      if (cat) {
        currencyRegex.value = `regex:${CurrencyTools.formatRegex(cat.code as CurrencyCode, false)}`
      }
    }
  )

  watch(
    () => form$.value?.invalid,
    () => {
      isFormValid.value = !form$.value?.invalid
    }
  )

  const startAdd = () => {
    const newCn = CatalogueNumberHelper.newInstance()
    newCn.active = false
    editingCn.value = newCn
    nextTick(async () => {
      if (typeof form$.value?.validate === 'function') {
        await form$.value.validate()
      }
    })
  }

  const startEdit = (cn: CatalogueNumber) => {
    editingCn.value = structuredClone(toRaw(cn))
    nextTick(async () => {
      if (typeof form$.value?.validate === 'function') {
        await form$.value.validate()
      }
    })
  }

  const cancelEdit = () => {
    editingCn.value = null
  }

  const saveCn = async () => {
    if (!editingCn.value) return
    try {
      const isNew = !editingCn.value.id || editingCn.value.id <= 0
      const updatedStamp = {
        ...props.stamp,
        catalogueNumbers: [...props.stamp.catalogueNumbers]
      }

      if (isNew) {
        updatedStamp.catalogueNumbers.push(editingCn.value)
      } else {
        const idx = updatedStamp.catalogueNumbers.findIndex((c) => c.id === editingCn.value?.id)
        if (idx >= 0) {
          updatedStamp.catalogueNumbers[idx] = editingCn.value
        }
      }

      const savedStamp = await stampsStore.update(updatedStamp)
      $emit('stamp-updated', savedStamp)
      editingCn.value = null
    } catch (err: unknown) {
      Prompt.alert({
        message: t('messages.save-failure', {
          message: extractErrorMessage(err as Error)
        }),
        asHtml: true
      })
    }
  }

  const makeActive = async (id: number) => {
    try {
      const updatedStamp = await CatalogueNumberService.makeActive(id)
      const cnList = updatedStamp.catalogueNumbers || props.stamp.catalogueNumbers || []
      const updatedCnList = cnList.map((cn) => {
        return {
          ...cn,
          active: cn.id === id
        }
      })
      updatedStamp.catalogueNumbers = updatedCnList
      const activeCn = updatedCnList.find((cn) => cn.id === id)
      if (activeCn) {
        updatedStamp.activeCatalogueNumber = activeCn
      }
      $emit('stamp-updated', updatedStamp)
    } catch (err: unknown) {
      Prompt.alert({
        message: t('messages.save-failure', {
          message: extractErrorMessage(err as Error)
        }),
        asHtml: true
      })
    }
  }

  const deleteCn = async (cn: CatalogueNumber) => {
    if (cn.active) return
    const confirmed = await Prompt.confirm({
      message: t('messages.delete-catalogueNumber', { number: cn.number })
    })
    if (confirmed) {
      try {
        const updatedStamp = {
          ...props.stamp,
          catalogueNumbers: [...props.stamp.catalogueNumbers]
        }
        const idx = updatedStamp.catalogueNumbers.findIndex((c) => c.id === cn.id)
        if (idx >= 0) {
          updatedStamp.catalogueNumbers.splice(idx, 1)
        }
        const savedStamp = await stampsStore.update(updatedStamp)
        if (savedStamp) {
          savedStamp.catalogueNumbers = updatedStamp.catalogueNumbers
        }
        $emit('stamp-updated', savedStamp)
      } catch (err: unknown) {
        Prompt.alert({
          message: t('messages.save-failure', {
            message: extractErrorMessage(err as Error)
          }),
          asHtml: true
        })
      }
    }
  }
</script>

<template>
  <div class="panel-form bg-white reference-catalogue-numbers">
    <div class="panel-form-title flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="sw-icon-references"></span>
        <span>{{ t('titles.reference-catalogue-numbers') }}</span>
      </div>
      <button
        class="text-[var(--vf-color-on-primary)] hover:text-gray-200 focus:outline-none"
        @click="$emit('close')"
      >
        <span class="sw-icon-cancel scale-110"></span>
      </button>
    </div>

    <!-- Edit Form View -->
    <div
      v-if="editingCn"
      class="panel-form-form form-text-sm flex flex-col h-full overflow-y-auto pr-2"
    >
      <Vueform v-model="editingCn" ref="form$" sync size="sm" :display-errors="false">
        <GroupElement name="group-cn-details">
          <HiddenElement :meta="true" name="id" />
          <HiddenElement :meta="true" name="active" />
          <CatalogueSelector :label="t('form.catalogue')" rules="required"></CatalogueSelector>
          <ConditionSelector
            :label="t('form.condition')"
            :columns="{ container: 12, label: 12, wrapper: 6 }"
          ></ConditionSelector>
          <TextElement
            name="number"
            :label="t('form.number')"
            rules="required|max:25"
            :columns="{ container: 12, label: 12, wrapper: 6 }"
            autocomplete="off"
          ></TextElement>
          <GroupElement
            :label="t('form.value')"
            name="group-value"
            :columns="{ container: 12, label: 12, wrapper: 12 }"
          >
            <TextElement
              name="value"
              :disabled="editingCn?.unknown || false"
              input-type="search"
              force-numbers
              :columns="{ default: 6 }"
              :rules="currencyRegex ? `nullable|${currencyRegex}` : 'nullable'"
              autocomplete="off"
            ></TextElement>
            <div class="col-span-6 flex items-center text-xs h-8">
              ({{ getCatalogueCurrency(editingCn?.catalogueRef) }})
            </div>
          </GroupElement>
          <CheckboxElement name="unknown">
            {{ t('form.no-value-listed') }}
          </CheckboxElement>
          <CheckboxElement name="nospace">
            {{ t('form.no-space') }}
          </CheckboxElement>
        </GroupElement>
      </Vueform>

      <div class="panel-form-buttonbar mt-auto pt-2">
        <PrimaryButton class="mr-2 text-sm" :disabled="!isFormValid" @click="saveCn">
          {{ t('actions.save') }}
        </PrimaryButton>
        <SecondaryButton class="text-sm" @click="cancelEdit">
          {{ t('actions.cancel') }}
        </SecondaryButton>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="panel-form-form flex flex-col h-full overflow-y-hidden">
      <div class="flex mb-4">
        <PrimaryButton class="text-sm py-1.5" icon="sw-icon-plus" @click="startAdd">
          {{ t('actions.add-catalogueNumber') }}
        </PrimaryButton>
      </div>

      <div class="flex-grow overflow-y-auto space-y-3 pr-1">
        <div
          v-for="cn in sortedCatalogueNumbers"
          :key="cn.id"
          class="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/60 hover:bg-gray-50 transition-all shadow-sm"
        >
          <div class="flex flex-col space-y-1 flex-grow min-w-0 mr-4">
            <span class="text-xs text-gray-800">
              {{ getCatalogueName(cn.catalogueRef) }}
            </span>
            <span class="text-sm font-bold text-gray-800">
              {{ cn.number }}
            </span>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span class="font-medium bg-gray-200/60 px-1.5 py-0.5 rounded text-gray-600">
                {{ ConditionHelper.toString(cn.condition) }}
              </span>
              <span class="font-semibold text-emerald-600">
                {{
                  cn.unknown
                    ? t('form.no-value-listed')
                    : CurrencyTools.asCurrencyString(
                        cn.value,
                        getCatalogueCurrency(cn.catalogueRef)
                      )
                }}
              </span>
              <span v-if="cn.nospace" class="text-gray-400 italic">
                ({{ t('form.no-space') }})
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span
              v-if="cn.active"
              class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200/50 shadow-sm"
            >
              Active
            </span>
            <span
              v-else
              class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200/50"
            >
              Secondary
            </span>

            <div class="flex items-center gap-2 pl-2 border-l border-gray-200/60">
              <button
                class="hover:text-[var(--vf-primary)] text-gray-400 focus:outline-none transition-colors"
                @click="startEdit(cn)"
                :title="t('actions.edit')"
              >
                <span class="sw-icon-edit scale-110"></span>
              </button>

              <button
                v-if="!cn.active"
                class="hover:text-emerald-600 text-gray-400 focus:outline-none transition-colors"
                @click="makeActive(cn.id)"
                :title="t('actions.make-active')"
              >
                <span class="sw-icon-ok scale-110"></span>
              </button>

              <button
                v-if="!cn.active"
                class="hover:text-red-500 text-gray-400 focus:outline-none transition-colors"
                @click="deleteCn(cn)"
                :title="t('actions.delete')"
              >
                <span class="sw-icon-delete scale-110"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-form-buttonbar mt-auto pt-4 border-t border-gray-100">
        <SecondaryButton class="w-full text-sm py-1.5" @click="$emit('close')">
          {{ t('actions.cancel') }}
        </SecondaryButton>
      </div>
    </div>
  </div>
</template>
<style>
  .reference-catalogue-numbers .form-text-sm {
    font-size: var(--var-text-size-sm);
  }

  .reference-catalogue-numbers .form-text-small-sm {
    font-size: 0.875em;
  }
</style>
