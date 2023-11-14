<script setup lang="ts" generic="T extends PersistedModel">
  import { AgGridVue } from 'ag-grid-vue3'
  import { ref, watch, nextTick, onMounted, onBeforeUnmount, onUpdated } from 'vue'

  import type { PersistedModel } from '@/models/entityModels'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import { isNil } from '@/util/object-utils'

  const gridApi = ref()
  const gridEl = ref()

  const props = defineProps({
    rowData: Array<T>,
    columnDefs: Array<ColumnDefinition>,
    context: Object as any
  })
  const emit = defineEmits(['selected'])

  const columns = Object.freeze(props.columnDefs)

  watch(
    () => [[props.rowData]],
    async () => {
      await nextTick()
      if (!isNil(gridApi.value)) {
        gridApi.value.showLoadingOverlay()
        gridApi.value.setRowData(props.rowData)
        gridApi.value.hideOverlay()
      }
    },
    { deep: true }
  )

  const observer = new ResizeObserver(() => {
    resizeColumns()
  })

  const onGridReady = (params: any) => {
    gridApi.value = params.api
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

  defineExpose({ resizeColumns })
</script>
<template>
  <ag-grid-vue
    ref="gridEl"
    class="ag-theme-stamp-web grid flex-shrink h-full flex-auto flex-grow min-h-[5rem]"
    :columnDefs="columns"
    :rowData="props.rowData"
    :context="context"
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
