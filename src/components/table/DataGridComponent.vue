<script setup lang="ts" generic="T extends PersistedModel">
import { AgGridVue } from 'ag-grid-vue3'
import { ref, watch, nextTick } from 'vue'

import type { PersistedModel } from '@/models/entityModels'
import { ColumnDefinition } from '@/components/table/DataGridModels'
import { isNil } from '@/util/object-utils'

const gridApi = ref()

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

const resizeColumns = () => {
  // Need to re-render the column layout when there is a slide out panel
  // or other changing in the display.  A nextTick() is insufficient to
  // wait for the previous ag-grid rendering so we have to add some additional
  // time and use a timeout.
  setTimeout(() => {
    if (gridApi.value) {
      gridApi.value.sizeColumnsToFit()
    }
  }, 200)
}

defineExpose({ resizeColumns })
</script>
<template>
  <ag-grid-vue
    class="ag-theme-stamp-web grid flex-shrink flex-auto flex-grow min-h-[5rem]"
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
