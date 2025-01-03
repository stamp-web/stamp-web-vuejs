<script setup lang="ts">
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  } from '@headlessui/vue'
  import { useI18n } from 'vue-i18n'
  import { ref, watch } from 'vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

  const { t } = useI18n()

  const $form = ref()

  const $props = defineProps({
    isOpen: Boolean
  })

  const model = defineModel<{ title: string; includeCountries: boolean; includeNotes: boolean }>()

  model.value = {
    includeNotes: true,
    includeCountries: true,
    title: ''
  }
  const $emit = defineEmits(['close'])

  watch(
    () => [$props.isOpen],
    () => {
      if ($props.isOpen && model.value) {
        model.value.title = t('reports.defaultTitle')
      }
    }
  )

  const submitModal = () => {
    $emit('close', true, model.value)
  }

  const closeModal = () => {
    $emit('close', false)
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
              id="stamp-report-generator-dialog"
              class="flex flex-col max-w-md max-h-64 min-h-64 min-w-96 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg font-medium border-gray-300 border-b pb-2">
                <span class="sw-icon-print"></span>{{ t('titles.generate-report') }}
              </DialogTitle>
              <div class="mt-2 flex flex-col flex-grow-0 overflow-hidden">
                <Vueform
                  v-model="model"
                  sync
                  ref="$form"
                  size="sm"
                  :display-errors="false"
                  :endpoint="false"
                >
                  <TextElement
                    name="title"
                    :label="t('form.report-title')"
                    :columns="{ default: 12 }"
                    autocomplete="off"
                  ></TextElement>
                  <CheckboxElement name="includeCountries" :default="true">{{
                    t('form.include-countries')
                  }}</CheckboxElement>
                  <CheckboxElement name="includeNotes" :default="true">{{
                    t('form.include-notes')
                  }}</CheckboxElement>
                </Vueform>
              </div>
              <div class="mt-auto flex flex-row items-center">
                <PrimaryButton @click="submitModal()" class="ml-auto mr-2">{{
                  t('actions.print-report')
                }}</PrimaryButton>
                <SecondaryButton @click="closeModal()">{{ t('actions.cancel') }}</SecondaryButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
