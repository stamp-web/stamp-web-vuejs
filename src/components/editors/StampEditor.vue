<script lang="ts" setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import StampDetailsForm from '@/components/forms/StampDetailsForm.vue'
  import ActiveCatalogueNumberForm from '@/components/forms/ActiveCatalogueNumberForm.vue'
  import StampOwnershipForm from '@/components/forms/StampOwnershipForm.vue'

  import type { Stamp } from '@/models/Stamp'
  import { type Ownership } from '@/models/Ownership'
  import type { CatalogueNumber } from '@/models/CatalogueNumber'
  import { fixFraction } from '@/util/object-utils'
  import { StampModelHelper } from '@/models/Stamp'

  const { t } = useI18n()

  const $props = defineProps({
    // @ts-ignore
    model: {} as Stamp
  })

  const stampModel = ref<Stamp>()
  const activeCatalogueNumber = ref<CatalogueNumber>()
  const stampOwnership = ref<Ownership>()

  const state = ref({
    wantList: false,
    edit: false,
    prefix: '',
    countryName: ''
  })

  const validation = ref({
    stamp: true,
    cn: true,
    owner: true
  })

  defineEmits(['cancel', 'save'])

  watch(
    () => [$props.model],
    () => {
      setRefs()
    }
  )

  const setCountryName = (countryName: string) => {
    state.value.countryName = countryName
    calculateImagePath()
  }
  const setImagePrefix = (prefix: string) => {
    state.value.prefix = prefix
    calculateImagePath()
  }

  const calculateImagePath = (force: boolean = false) => {
    let path = ''
    const cn = activeCatalogueNumber.value
    const stamp = stampModel.value
    if (
      stamp &&
      cn &&
      stampOwnership.value &&
      (!state.value.edit || force) &&
      !state.value.wantList &&
      stamp.countryRef > 0 &&
      cn.catalogueRef > 0 &&
      cn.condition >= 0 &&
      cn.number !== ''
    ) {
      path = StampModelHelper.calculateImagePath(
        stamp,
        cn,
        state.value.countryName,
        state.value.prefix,
        true
      )
      stampOwnership.value.img = path
    }
    return path
  }

  const title = computed(() => {
    return t($props.model && $props.model.id >= 0 ? 'titles.edit-stamp' : 'titles.new-stamp')
  })

  const validForm = computed(() => {
    const result =
      validation.value.stamp &&
      validation.value.cn &&
      ((stampOwnership.value && validation.value.owner) ||
        (state.value.wantList && !stampOwnership.value))
    return result
  })

  /**
   * Since there are several models which are being used in sub forms these are stripping out attributes
   * that are not edited or used (such as IDs) so we restore the objects by merging in the new values
   * into the previous values
   *
   * TODO: clech clearing fields like purchased works
   */
  const getSaveModel = () => {
    const m = Object.assign($props.model, stampModel.value)
    m.activeCatalogueNumber = Object.assign(m.activeCatalogueNumber, activeCatalogueNumber.value)
    if (m.stampOwnerships?.length > 0) {
      m.stampOwnerships[0] = Object.assign(m.stampOwnerships[0], stampOwnership.value)
      // Fix any data members that are not in the pure data formats (despite editor configurations)
      if (m.stampOwnerships[0].pricePaid && typeof m.stampOwnerships[0].pricePaid === 'string') {
        m.stampOwnerships[0].pricePaid = fixFraction(m.stampOwnerships[0].pricePaid)
      }
    }
    // Fix any data members that are not in the pure data formats (despite editor configurations)
    if (typeof m.activeCatalogueNumber.value === 'string') {
      m.activeCatalogueNumber.value = fixFraction(m.activeCatalogueNumber.value)
    }
    return m
  }

  const setRefs = () => {
    stampModel.value = $props.model
    activeCatalogueNumber.value = $props.model.activeCatalogueNumber
    if ($props.model.stampOwnerships?.length > 0) {
      stampOwnership.value = $props.model.stampOwnerships[0]
    }
    state.value.wantList = stampModel.value?.wantList || false
    state.value.edit = $props.model?.id > 0
  }

  onMounted(async () => {
    setRefs()
  })

  defineExpose({ calculateImagePath, setRefs })
</script>

<template>
  <div class="panel-form bg-white">
    <div class="panel-form-title"><span class="sw-icon-stamp"></span>{{ title }}</div>
    <div class="flex flex-row w-full overflow-y-auto stamp-editor">
      <div class="flex flex-col w-full p-2 pt-0">
        <StampDetailsForm
          v-model="stampModel"
          @validationChanged="(v: boolean) => (validation.stamp = v)"
          @country-updated="setCountryName"
          class="mb-2"
        ></StampDetailsForm>
        <ActiveCatalogueNumberForm
          v-model="activeCatalogueNumber"
          @validationChanged="(v: boolean) => (validation.cn = v)"
          @catalogueNumber-info-changed="calculateImagePath"
          @catalogue-prefix="setImagePrefix"
        ></ActiveCatalogueNumberForm>
      </div>
      <div v-if="!state.wantList" class="flex flex-col w-full p-2 pl-0 pt-0">
        <StampOwnershipForm
          v-model="stampOwnership"
          @validationChanged="(v: boolean) => (validation.owner = v)"
          @regenerateImagePath="calculateImagePath(true)"
        ></StampOwnershipForm>
      </div>
    </div>
    <div class="panel-form-buttonbar mt-auto pt-2">
      <PrimaryButton
        class="mr-2 text-sm"
        :disabled="!validForm"
        @click="$emit('save', getSaveModel())"
        >{{ t('actions.save') }}</PrimaryButton
      >
      <SecondaryButton class="text-sm" @click="$emit('cancel')">{{
        t('actions.cancel')
      }}</SecondaryButton>
    </div>
  </div>
</template>
<style>
  .stamp-editor .form-text-sm {
    font-size: 12px;
  }

  .stamp-editor .form-text-small-sm {
    font-size: 11px;
  }

  .stamp-editor .form-bg-danger {
    margin-top: 0.5rem;
    padding: 0.5rem;
  }
</style>
