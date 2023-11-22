<script setup lang="ts" generic="T extends PersistedModel">
  import { AgGridVue } from 'ag-grid-vue3'
  import '../../../node_modules/ag-grid-community/styles/ag-grid.css'
  import '../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css'
  import { ref, watch, nextTick, onMounted, onBeforeUnmount, onUpdated } from 'vue'

  import type { PersistedModel } from '@/models/entityModels'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import { isNil } from '@/util/object-utils'

  const gridApi = ref()
  const gridEl = ref()
  const loading = ref(false)

  const props = defineProps({
    rowData: Array<T>,
    columnDefs: Array<ColumnDefinition>
  })
  const emit = defineEmits(['selected'])

  const columns = Object.freeze(props.columnDefs)

  watch(
    () => [[props.rowData]],
    async () => {
      await nextTick()
      if (!isNil(gridApi.value)) {
        gridApi.value.setRowData(props.rowData)
      }
    },
    { deep: true }
  )

  watch(
    () => [[loading.value]],
    () => {
      if (!isNil(gridApi.value)) {
        if (loading.value) {
          gridApi.value.showLoadingOverlay()
        } else {
          gridApi.value.hideOverlay()
        }
      }
    }
  )

  const observer = new ResizeObserver(() => {
    resizeColumns()
  })

  const onGridReady = (params: any) => {
    gridApi.value = params.api
    if (loading.value) {
      gridApi.value.showLoadingOverlay()
    }
    resizeColumns()
  }

  const onSelected = () => {
    const selected: Array<T> = gridApi.value.getSelectedRows()
    if (selected) {
      selected.forEach((item: T) => {
        emit('selected', item)
      })
    }
  }

  const resizeColumns = async () => {
    await nextTick()
    if (gridApi.value) {
      gridApi.value.sizeColumnsToFit()
    }
  }

  const loadingStarted = () => {
    loading.value = true
  }

  const loadingComplete = () => {
    loading.value = false
  }

  onMounted(async () => {
    if (gridEl.value.$el) {
      observer.observe(gridEl.value.$el)
    }
  })

  onUpdated(() => {
    resizeColumns()
  })

  onBeforeUnmount(() => {
    // cleanup to prevent any memory leaks
    observer.disconnect()
  })

  defineExpose({ resizeColumns, loadingComplete, loadingStarted })
</script>
<template>
  <ag-grid-vue
    ref="gridEl"
    :class="`ag-theme-stamp-web grid flex-shrink h-full flex-auto flex-grow min-h-[5rem] grid-loading-${loading}`"
    :columnDefs="columns"
    :rowData="props.rowData"
    rowSelection="single"
    rowHeight="36"
    suppressRowDeselection="false"
    @grid-ready="onGridReady"
    @selection-changed="onSelected"
  >
  </ag-grid-vue>
</template>

<style scoped lang="scss">
  @use '../../../node_modules/ag-grid-community/styles' as ag;
  @include ag.grid-styles(
    (
      theme: stamp-web,
      extend-theme: alpine,
      row-hover-color: #f3f4f6,
      // green-50
      --ag-foreground-color: #374151,
      --ag-selected-row-background-color: #ecfdf5,
      //--ag-header-foreground-color: #ffffff,
      --ag-header-background-color: #e5e7eb,
      --ag-range-selection-border-color: transparent,
      //--ag-header-cell-hover-background-color: #374151
    )
  );
</style>
