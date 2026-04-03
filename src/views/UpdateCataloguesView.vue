<script setup lang="ts">
  import { inject, nextTick, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import type { Log } from 'vuejs3-logger'

  import CatalogueSelector from '@/components/inputs/CatalogueSelector.vue'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import { ColumnDefinition } from '@/components/table/DataGridModels'

  import type { AugmentedStamp, Stamp } from '@/models/Stamp'
  import { preferenceStore } from '@/stores/preferenceStore'
  import { stampStore } from '@/stores/stampStore'
  import { createCatalogueUpdateColumnDefs } from '@/views/behaviors/columnDefs'
  import type { PreferencePaths } from '@/views/types/preferencePaths'
  import { OdataUtil } from '@/util/odata-util'

  const { t } = useI18n()
  const logger = inject('vuejs3-logger') as Log
  const router = useRouter()
  const route = useRoute()

  const dataGridRef = ref()
  const store = stampStore()
  const prefStore = preferenceStore()

  const matchingStamps = ref<Stamp[]>([])

  const isSaveEnabled = ref<boolean>(false)

  type SelectionModel = {
    newCatalogueRef: number
    currentCatalogueRef: number
  }

  const prefPaths = ref<PreferencePaths>({
    imagePath: '/',
    thumbPath: '/'
  })

  const modelValue = ref<SelectionModel>()
  const form$ = ref()

  const columnDefs = ref<ColumnDefinition[]>(createCatalogueUpdateColumnDefs(prefPaths.value))

  const findMatchingStamps = async () => {
    if (!canUpdate()) {
      return
    }

    try {
      const filterQuery = route.query.$filter as string
      const allStamps = await store.find({
        $filter: filterQuery,
        $orderby: OdataUtil.createSort('number', 'asc')
      })
      const cn = modelValue.value?.currentCatalogueRef
      matchingStamps.value = allStamps.filter((stamp: Stamp) => {
        return stamp.activeCatalogueNumber?.catalogueRef === cn
      })
      if (matchingStamps.value.length > 0) {
        await nextTick()
        await dataGridRef.value.editCell(0, 'newValue')
      }

      logger.info(`Found ${matchingStamps.value.length} stamps matching the new catalogue`)
    } catch (err) {
      logger.error('Error finding matching stamps:', err)
      matchingStamps.value = []
    }
  }

  const changedCell = (obj: unknown) => {
    if (obj) {
      const stamp = obj as AugmentedStamp
      if (stamp.activeCatalogueNumber && modelValue.value?.newCatalogueRef) {
        stamp.activeCatalogueNumber.catalogueRef = modelValue.value?.newCatalogueRef
      }
      if (stamp.activeCatalogueNumber?.unknown) {
        stamp.activeCatalogueNumber.value = 0
      }
      stamp.updated = true
    }
    isSaveEnabled.value = true
  }

  const handleUpdate = async () => {
    if (!canUpdate()) {
      return
    }
    await findMatchingStamps()
  }

  const canUpdate = () => {
    return (
      modelValue.value &&
      modelValue.value.currentCatalogueRef > 0 &&
      modelValue.value.newCatalogueRef > 0
    )
  }

  const save = async () => {
    try {
      const editedValues = dataGridRef.value.getEditedCells()
      const catalogueRef = modelValue.value?.newCatalogueRef
      editedValues.forEach(async (editedStamp: Stamp) => {
        const cn = editedStamp.activeCatalogueNumber
        if (cn && catalogueRef && catalogueRef > 0) {
          cn.catalogueRef = catalogueRef
        }
        dataGridRef.value.loadingStarted()
        await store.update(editedStamp)
        await findMatchingStamps()
      })
      //router.back()
    } catch (err) {
      logger.error('Error saving catalogue updates:', err)
    }
  }

  const goBack = () => {
    router.back()
  }

  onMounted(async () => {
    dataGridRef.value.loadingStarted()

    const catalogueRef = await prefStore.findByNameAndCategory('catalogueRef', 'stamps')
    const thumbPref = await prefStore.findByNameAndCategory('thumbPath', 'stamps')
    const imagePref = await prefStore.findByNameAndCategory('imagePath', 'stamps')

    modelValue.value = {
      newCatalogueRef: -1,
      currentCatalogueRef: parseInt(catalogueRef?.value ?? '-1', 10)
    }
    prefPaths.value.thumbPath = thumbPref.value ?? '/'
    prefPaths.value.imagePath = imagePref.value ?? '/'
  })
</script>

<template>
  <div class="col-start-2 col-end-6 flex p-4 flex-grow h-full overflow-y-hidden flex-col">
    <div class="flex gap-4 flex-grow overflow-hidden">
      <div class="flex flex-col w-80 flex-shrink-0">
        <div class="mb-4 mt-1 text-base">
          <a href="#" @click="goBack" class="hover:underline"
            ><span class="sw-icon-stamp"></span>{{ t('navigation.stamps') }}</a
          >
          <span class="">
            / <span class="sw-icon-catalogue"></span>{{ t('titles.update-catalogues') }}</span
          >
        </div>
        <div class="bg-white mb-4" role="form">
          <Vueform
            size="sm"
            ref="form$"
            :model-value="modelValue"
            class="panel-form-form"
            sync
            :endpoint="false"
          >
            <CatalogueSelector :label="t('form.current-catalogue')" name="currentCatalogueRef" />
            <CatalogueSelector :label="t('form.new-catalogue')" name="newCatalogueRef" />
          </Vueform>
        </div>
        <div>
          <PrimaryButton @click="handleUpdate" :disabled="!canUpdate()">
            {{ t('actions.update') }}
          </PrimaryButton>
        </div>
      </div>

      <div class="flex flex-col flex-grow overflow-hidden">
        <div class="flex-grow overflow-hidden mb-4">
          <DataGridComponent
            ref="dataGridRef"
            :columnDefs="columnDefs"
            :rowData="matchingStamps"
            :multi-select="false"
            @cell-value-changed="changedCell"
          />
        </div>

        <div class="flex justify-end gap-2">
          <SecondaryButton @click="goBack">
            {{ t('actions.cancel') }}
          </SecondaryButton>
          <PrimaryButton @click="save" :disabled="!isSaveEnabled">
            {{ t('actions.save') }}
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>
