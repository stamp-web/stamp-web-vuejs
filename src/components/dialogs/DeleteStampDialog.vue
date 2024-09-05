<script lang="ts" setup>
  import { watch, ref, nextTick } from 'vue'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle
  } from '@headlessui/vue'
  import { useI18n } from 'vue-i18n'
  // eslint-disable-next-line you-dont-need-lodash-underscore/clone-deep
  import _cloneDeep from 'lodash-es/cloneDeep'

  import type { Stamp } from '@/models/Stamp'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import ImagePreview from '@/components/display/ImagePreview.vue'
  import { resolvePath } from '@/util/object-utils'

  const { t } = useI18n()

  const $props = defineProps({
    isOpen: Boolean,
    stamps: Array<Stamp>,
    prefPaths: {} as any
  })

  const selectedStamps = ref(new Array<Stamp>())

  const $emit = defineEmits(['close'])

  watch(
    () => [$props.isOpen],
    async () => {
      if ($props.isOpen) {
        await nextTick()
        setInitialSelected()
      }
    }
  )

  const setInitialSelected = () => {
    selectedStamps.value = []
    if ($props.stamps && $props.stamps.length > 0) {
      selectedStamps.value = _cloneDeep($props.stamps)
    }
  }
  const closeModal = (submit = false) => {
    if (submit) {
      $emit('close', selectedStamps.value)
    } else {
      $emit('close')
    }
  }

  const toggled = (stamp: Stamp) => {
    const idx = selectedStamps.value
      .map((e) => {
        return e.id
      })
      .indexOf(stamp.id)
    if (idx >= 0) {
      selectedStamps.value.splice(idx, 1)
    } else {
      selectedStamps.value.push(stamp)
    }
  }

  const imageUrl = (stamp: Stamp) => {
    let img = undefined
    const value = resolvePath(stamp, 'stampOwnerships[0].img') as string
    if (value) {
      const indx = value.lastIndexOf('/')
      const path = value.substring(0, indx + 1) + 'thumb-' + value.substring(indx + 1)
      img = `${$props.prefPaths?.thumbPath ?? ''}/${path}`
    }
    return img
  }
</script>

<template>
  <TransitionRoot appear :show="$props.isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-1000">
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
              class="w-full max-w-md max-h-96 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg font-medium">
                <span class="sw-icon-delete"></span>{{ t('titles.delete-stamps') }}
              </DialogTitle>
              <div class="mt-2 flex flex-col flex-grow-0 overflow-hidden">
                <span>{{ t('messages.delete-stamps') }}</span>
                <div
                  class="overflow-y-auto flex flex-col max-h-48 w-full border border-gray-300 mt-2"
                >
                  <template v-for="stamp in $props.stamps" :key="stamp.id">
                    <div
                      class="p-1 border-b border-gray-300 flex flex-row flex-grow align-middle items-center"
                    >
                      <span class="w-[56px] min-w-[56px] flex items-center justify-center">
                        <image-preview
                          :showNa="true"
                          :max-height="'56'"
                          :max-width="'56'"
                          :image-url="imageUrl(stamp)"
                        ></image-preview>
                      </span>

                      <div class="flex-auto px-2 overflow-ellipsis flex">
                        {{ stamp.rate }} - {{ stamp.description }}
                      </div>
                      <Vueform size="sm">
                        <ToggleElement
                          size="sm"
                          class="ml-auto w-16"
                          :default="true"
                          :columns="{ container: 12, wrapper: 12, label: 0 }"
                          :name="`included${stamp.id}`"
                          @change="toggled(stamp)"
                          :labels="{ on: t('actions.yes'), off: t('actions.no') }"
                        ></ToggleElement>
                      </Vueform>
                    </div>
                  </template>
                </div>
              </div>
              <div class="mt-4 flex flex-row">
                <span>{{
                  t('display.deleting-count', {
                    count: selectedStamps.length,
                    total: $props.stamps?.length ?? 0
                  })
                }}</span>
                <PrimaryButton
                  @click="closeModal(true)"
                  :disabled="selectedStamps.length < 1"
                  class="ml-auto mr-2"
                  >{{ t('actions.delete') }}</PrimaryButton
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
