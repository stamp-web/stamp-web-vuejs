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
    dataGridRef.value.loadingStarted()
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
    } finally {
      dataGridRef.value.loadingComplete()
    }
  }

  const changedCell = (obj: unknown, colId?: string) => {
    if (obj) {
      const stamp = obj as AugmentedStamp
      if (stamp.activeCatalogueNumber && modelValue.value?.newCatalogueRef) {
        stamp.activeCatalogueNumber.catalogueRef = modelValue.value?.newCatalogueRef
      }
      if (stamp.activeCatalogueNumber?.unknown) {
        stamp.activeCatalogueNumber.value = 0
      }
      stamp.updated = true

      // Force the grid to refresh cells so that cross-column dependencies (like 'unknown'
      // affecting the 'newValue' column) are re-evaluated and the UI updates properly.
      nextTick(() => {
        const dg = dataGridRef.value
        if (dg && typeof dg.redrawRows === 'function') {
          dg.redrawRows()
        }

        // AG Grid naturally exits edit mode on other cells when one is interacted with.
        // If the 'unknown' checkbox was unchecked, we programmatically put
        // the 'newValue' column back into edit mode for this row.
        if (colId === 'unknown' && !stamp.activeCatalogueNumber?.unknown && typeof dg?.editCell === 'function') {
          const rowIndex = matchingStamps.value.findIndex((s) => s.id === stamp.id)
          if (rowIndex >= 0) {
            nextTick(() => {
              dg.editCell(rowIndex, 'newValue')
            })
          }
        }
      })
    }
    isSaveEnabled.value = true
  }

  const canUpdate = () => {
    return (
      modelValue.value &&
      modelValue.value.currentCatalogueRef > 0 &&
      modelValue.value.newCatalogueRef > 0
    )
  }

  const save = async () => {
    dataGridRef.value.loadingStarted()
    try {
      const editedValues = dataGridRef.value.getEditedCells()
      const catalogueRef = modelValue.value?.newCatalogueRef

      if (!catalogueRef || catalogueRef <= 0) {
        logger.warn('New catalogue is not selected. Cannot save.')
        return
      }

      const updatePromises = editedValues.map((editedStamp: Stamp) => {
        const cn = editedStamp.activeCatalogueNumber
        if (cn) {
          cn.catalogueRef = catalogueRef
        }
        return store.update(editedStamp)
      })

      await Promise.all(updatePromises)
      await findMatchingStamps()
    } catch (err) {
      logger.error('Error saving catalogue updates:', err)
    } finally {
      dataGridRef.value.loadingComplete()
    }
  }

  const goBack = () => {
    router.back()
  }

  onMounted(async () => {
    dataGridRef.value.loadingStarted()
    try {
      const [catalogueRef, thumbPref, imagePref] = await Promise.all([
        prefStore.findByNameAndCategory('catalogueRef', 'stamps'),
        prefStore.findByNameAndCategory('thumbPath', 'stamps'),
        prefStore.findByNameAndCategory('imagePath', 'stamps')
      ])

      modelValue.value = {
        newCatalogueRef: -1,
        currentCatalogueRef: parseInt(catalogueRef?.value ?? '-1', 10)
      }
      prefPaths.value.thumbPath = thumbPref.value ?? '/'
      prefPaths.value.imagePath = imagePref.value ?? '/'
    } catch (err) {
      logger.error('Error fetching preferences on mount:', err)
    } finally {
      dataGridRef.value.loadingComplete()
    }
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
          <PrimaryButton @click="findMatchingStamps" :disabled="!canUpdate()">
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
