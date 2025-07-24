<script setup lang="ts">
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  } from '@headlessui/vue'
  import { type Log } from 'vuejs3-logger'
  import { useI18n } from 'vue-i18n'
  import { computed, inject, nextTick, ref, watch } from 'vue'

  import { type Stamp } from '@/models/Stamp'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import CurrencySelector from '@/components/inputs/CurrencySelector.vue'
  import { CurrencyCode, CurrencyTools } from '@/models/CurrencyCode'
  import stampService from '@/services/StampService'

  const { t } = useI18n()
  const logger = inject('vuejs3-logger') as Log

  const $form = ref()
  const $pricePaid = ref()

  const $props = defineProps({
    isOpen: Boolean,
    stamps: Array<Stamp>,
    code: String
  })
  const state = ref({
    currencyRegex: `regex:${CurrencyTools.formatRegex(CurrencyCode.USD, false)}`,
    percentage: '0.00',
    count: 0
  })

  const model = defineModel<{ code: CurrencyCode; existing: boolean; pricePaid: string }>()
  model.value = {
    existing: true,
    pricePaid: '',
    code: CurrencyCode.USD
  }
  const $emit = defineEmits(['close'])

  watch(
    () => [$props.isOpen],
    async () => {
      if ($props.isOpen) {
        await nextTick()
        if ($props.code && model.value) {
          model.value.code = $props.code as CurrencyCode
        }
        if ($props.stamps) {
          calculateValues()
        }
        $form.value.validate()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const c = submitInvalid.value
      }
    }
  )

  const filterStamps = (stamps: Stamp[], includeExisting: boolean = true): Stamp[] => {
    return stamps.filter((s) => {
      return !(s.wantList || (!includeExisting && s.stampOwnerships[0].pricePaid > 0))
    })
  }
  /**
   * Calculate the catalogue value total for the stamps, skipping any wantlists (since they will not be owned)
   *
   * @param stamps
   */
  const calculateStampCatalogueTotal = (stamps: Stamp[], includeExisting: boolean = true) => {
    let total = 0.0
    if (stamps) {
      const filtered = filterStamps(stamps, includeExisting)
      filtered.forEach((s) => {
        total += s.activeCatalogueNumber?.value ?? 0
      })
    }
    return total
  }

  const submitInvalid = computed(() => {
    const v =
      ($form.value && $form.value.invalid) ||
      model.value?.pricePaid === null ||
      model.value?.pricePaid === ''
    return v
  })

  const stampCount = computed(() => {
    let count = 0
    if ($props.stamps) {
      const includeExisting = model.value?.existing
      count = $props.stamps.length
      $props.stamps.forEach((s) => {
        if (s.wantList || (!includeExisting && s.stampOwnerships[0].pricePaid > 0)) {
          count--
        }
      })
    }
    return count
  })

  const calculateValues = () => {
    if ($props.stamps) {
      const total = calculateStampCatalogueTotal($props.stamps, model.value?.existing)
      state.value.count = stampCount.value
      $pricePaid.value.validate().then(() => {
        if (!$pricePaid.value.invalid && model.value?.pricePaid && total > 0.0) {
          state.value.percentage = ((100 * parseFloat(model.value.pricePaid)) / total).toFixed(2)
        } else {
          logger.debug('Purchase price was invalid or the total was not defined')
          state.value.percentage = '0.00'
        }
      })
    }
  }

  const currencyChange = async () => {
    if (model.value?.code) {
      const oldRegex = state.value.currencyRegex
      state.value.currencyRegex = `regex:${CurrencyTools.formatRegex(model.value?.code, false)}`
      if (oldRegex !== state.value.currencyRegex && $pricePaid.value) {
        logger.info('Detected currency regex change.  Revalidating purchase price')
        await nextTick()
        $pricePaid.value.reinitValidation()
        $pricePaid.value.validate()
      }
    }
  }

  const closeModal = async (submit = false) => {
    if (submit) {
      if ($props.stamps && model.value?.pricePaid) {
        const filtered = filterStamps($props.stamps, model.value?.existing)
        logger.debug('filtered stamp count is ', filtered.length)
        await stampService.purchase(
          filtered,
          parseFloat(model.value?.pricePaid),
          model.value?.code ?? CurrencyCode.USD
        )
      }
    }
    $emit('close', submit)
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
              id="stamp-purchase-dialog"
              class="flex flex-col max-w-md max-h-64 min-h-64 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg font-medium border-gray-300 border-b pb-2">
                <span class="sw-icon-purchased"></span>{{ t('titles.purchase-price') }}
              </DialogTitle>
              <div class="mt-2 flex flex-col flex-grow-0 overflow-hidden">
                <Vueform
                  v-model="model"
                  ref="$form"
                  size="sm"
                  :display-errors="false"
                  :endpoint="false"
                >
                  <GroupElement
                    name="group-price"
                    :columns="{ container: 12, label: 12, wrapper: 12 }"
                    :label="t('form.pricePaid')"
                    ><TextElement
                      name="pricePaid"
                      ref="$pricePaid"
                      :add-Classes="{
                        ElementLayout: {
                          innerWrapperAfter: 'relative w-48'
                        },
                        ElementError: {
                          container: 'min-w-48'
                        }
                      }"
                      @change="calculateValues"
                      input-type="search"
                      :force-numbers="true"
                      :columns="{ default: 3 }"
                      :rules="`nullable|${state.currencyRegex}`"
                      autocomplete="off"
                    ></TextElement>
                    <CurrencySelector
                      v-model="model"
                      :value="CurrencyCode.USD"
                      :columns="{ default: 3 }"
                      @change="currencyChange"
                      style="z-index: 1000"
                    ></CurrencySelector>
                  </GroupElement>
                  <CheckboxElement name="existing" :default="true" @change="calculateValues">{{
                    t('form.modify-existing')
                  }}</CheckboxElement>
                </Vueform>
              </div>
              <div class="mt-auto flex flex-row items-center">
                <span class="text-sm" id="calculated-cost">{{
                  t('messages.calculated-cost', {
                    percentage: state.percentage,
                    count: state.count
                  })
                }}</span>
                <PrimaryButton
                  @click="closeModal(true)"
                  :disabled="submitInvalid"
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
