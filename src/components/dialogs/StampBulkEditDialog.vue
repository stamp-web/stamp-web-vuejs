<script setup lang="ts">
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  } from '@headlessui/vue'
  import { useI18n } from 'vue-i18n'
  import { computed, nextTick, ref, watch } from 'vue'

  import type { Stamp } from '@/models/Stamp'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import CountrySelector from '@/components/inputs/CountrySelector.vue'
  import AlbumSelector from '@/components/inputs/AlbumSelector.vue'
  import CatalogueSelector from '@/components/inputs/CatalogueSelector.vue'
  import SellerSelector from '@/components/inputs/SellerSelector.vue'
  import type { KeyIndexable } from '@/util/ts/key-accessor'
  import ProgressBar from '@/components/display/ProgressBar.vue'

  const { t } = useI18n()

  const $form = ref()
  const $isActive = ref(false)

  const $props = defineProps({
    isOpen: Boolean,
    showProgress: Boolean,
    stamps: Array<Stamp>
  })

  const model = defineModel<{
    properties: Array<string>
    albumRef: number
    catalogueRef: number
    countryRef: number
    sellerRef: number
    updateImagePath: boolean
  }>()
  model.value = {
    properties: [] as string[],
    albumRef: -1,
    catalogueRef: -1,
    countryRef: -1,
    sellerRef: -1,
    updateImagePath: true
  }
  const $emit = defineEmits(['close'])

  watch(
    () => [$props.isOpen],
    async () => {
      if ($props.isOpen) {
        await validate()
      } else {
        $isActive.value = false
      }
    }
  )

  watch(
    () => [model.value?.properties],
    async () => {
      await validate()
    }
  )
  watch(
    () => [model.value?.countryRef],
    async () => {
      await validate()
    },
    {
      deep: true
    }
  )

  const validate = async () => {
    await nextTick()
    $form.value.validate()
  }

  const submitInvalid = computed(() => {
    return $form.value && $form.value.invalid
  })

  const closeModal = async (submit = false) => {
    if (submit) {
      if ($props.stamps && model.value) {
        const m = Object.assign({}, model.value) as KeyIndexable
        Object.keys(m).forEach(
          (key) => (m[key] === undefined || key === 'properties') && delete m[key]
        )
        $isActive.value = true
        $emit('close', submit, m)
      }
    } else {
      $emit('close', submit)
    }
  }
</script>
<template>
  <TransitionRoot appear :show="$props.isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-999">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/20" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              id="stamp-bulk-edit-dialog"
              class="flex flex-col max-w-md max-h-[48rem] min-h-64 min-w-[24rem] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg font-medium border-gray-300 border-b pb-2">
                <span class="sw-icon-bulk-edit"></span>{{ t('titles.bulk-edit') }}
              </DialogTitle>
              <div class="mt-2 flex flex-col flex-grow-0 overflow-hidden">
                <Vueform
                  autocomplete="off"
                  v-model="model"
                  ref="$form"
                  size="sm"
                  :display-errors="false"
                  :endpoint="false"
                >
                  <MultiselectElement
                    name="properties"
                    class="z-999"
                    input-type="search"
                    autocomplete="off"
                    :hide-selected="false"
                    :close-on-select="true"
                    :close-on-deselect="true"
                    :label="t('form.select-property')"
                    :native="false"
                    rules="required"
                    :items="[
                      t('form.country'),
                      t('form.catalogue'),
                      t('form.album'),
                      t('form.seller')
                    ]"
                    :append-to-body="true"
                  ></MultiselectElement>
                  <div v-if="model?.properties.length === 0" class="col-span-12">
                    {{ t('messages.no-properties') }}
                  </div>
                  <CountrySelector
                    v-if="model?.properties.includes(t('form.country'))"
                    :label="t('form.country')"
                    autocomplete="off"
                    rules="required"
                    name="countryRef"
                  ></CountrySelector>
                  <CatalogueSelector
                    v-if="model?.properties.includes(t('form.catalogue'))"
                    :label="t('form.catalogue')"
                    autocomplete="off"
                    rules="required"
                    name="catalogueRef"
                  ></CatalogueSelector>
                  <AlbumSelector
                    v-if="model?.properties.includes(t('form.album'))"
                    :label="t('form.album')"
                    autocomplete="off"
                    rules="required"
                    name="albumRef"
                  ></AlbumSelector>
                  <SellerSelector
                    v-if="model?.properties.includes(t('form.seller'))"
                    :label="t('form.seller')"
                    autocomplete="off"
                    rules="required"
                    name="sellerRef"
                  ></SellerSelector>
                  <CheckboxElement
                    v-if="
                      model?.properties.includes(t('form.country')) ||
                      model?.properties.includes(t('form.catalogue'))
                    "
                    name="updateImagePath"
                    :default="true"
                    >{{ t('form.regenerate-image') }}</CheckboxElement
                  >
                </Vueform>
              </div>
              <div class="mt-auto pt-2 flex flex-row items-center">
                <span v-if="showProgress" class="w-24 h-4"
                  ><progress-bar :indeterminant="true"></progress-bar
                ></span>
                <PrimaryButton
                  @click="closeModal(true)"
                  :disabled="submitInvalid || $isActive"
                  class="ml-auto mr-2"
                  >{{ t('actions.save') }}</PrimaryButton
                >
                <SecondaryButton @click="closeModal(false)">{{
                  t('actions.cancel')
                }}</SecondaryButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
