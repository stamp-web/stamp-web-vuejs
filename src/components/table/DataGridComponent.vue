<script setup lang="ts" generic="T extends PersistedModel">
  import { AgGridVue } from 'ag-grid-vue3'
  import type { SortChangedEvent } from 'ag-grid-community'
  import { RowNode } from 'ag-grid-community'
  import '../../../node_modules/ag-grid-community/styles/ag-grid.css'
  import '../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css'
  import { ref, watch, nextTick, onMounted, onBeforeUnmount, onUpdated } from 'vue'

  import type { PersistedModel } from '@/models/entityModels'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import { isNil } from '@/util/object-utils'
  import type { KeyIndexable } from '@/util/ts/key-accessor'

  const gridApi = ref()
  const gridEl = ref()
  const loading = ref(false)

  const props = defineProps({
    rowData: Array<T>,
    columnDefs: Array<ColumnDefinition>,
    multiSelect: Boolean,
    columnVisibility: {},
    selectedData: Array<T>
  })
  const emit = defineEmits(['selected', 'deselected', 'sortChanged'])

  const columns = Object.freeze(props.columnDefs)
  const allowSelectionEvent = ref(true)

  watch(
    () => [[props.columnVisibility]],
    async () => {
      if (!isNil(gridApi.value)) {
        const keys = Object.keys(props.columnVisibility as KeyIndexable)
        keys.forEach((key) => {
          gridApi.value.columnModel.setColumnVisible(
            key,
            (props.columnVisibility as KeyIndexable)[key]
          )
        })
        await nextTick()
        resizeColumns()
      }
    }
  )

  watch(
    () => props.rowData,
    async () => {
      if (!isNil(gridApi.value)) {
        gridApi.value.setRowData(props.rowData)
        gridApi.value.deselectAll()
        setSelected(props.selectedData ?? new Array<T>())
      }
    },
    { deep: true }
  )

  watch(
    () => [[props.selectedData]],
    async () => {
      if (!isNil(gridApi.value)) {
        setSelected(props.selectedData ?? new Array<T>())
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

  const setSelected = async (selected: Array<T>) => {
    if (selected) {
      const selectedNodes = new Array<RowNode<T>>()
      if (selected.length > 0) {
        gridApi.value.forEachNode((node: RowNode<T>) => {
          if (selected.find((d) => d.id === node.data?.id)) {
            selectedNodes.push(node)
          }
        })
      }
      allowSelectionEvent.value = false
      gridApi.value.deselectAll()
      gridApi.value.setNodesSelected({ nodes: selectedNodes, newValue: true })
      allowSelectionEvent.value = true
    }
  }

  const observer = new ResizeObserver(() => {
    resizeColumns()
  })

  const onGridReady = (params: any) => {
    gridApi.value = params.api
    if (loading.value) {
      gridApi.value.showLoadingOverlay()
    }
    resizeColumns()
    setSelected(props.selectedData ?? new Array<T>())
  }

  const onSelected = (event: any) => {
    const selected = event.node?.data
    const isSelected = event.node?.isSelected()
    if (selected && allowSelectionEvent.value) {
      emit(isSelected ? 'selected' : 'deselected', selected)
    }
  }

  const onSortChanged = (event: SortChangedEvent<any>) => {
    emit(
      'sortChanged',
      event.columnApi.getColumnState().find((col) => col.sort)
    )
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
    :rowSelection="`${props.multiSelect ? 'multiple' : 'single'}`"
    rowMultiSelectWithClick="true"
    rowHeight="36"
    @sortChanged="onSortChanged"
    suppressRowDeselection="false"
    @grid-ready="onGridReady"
    @rowSelected="onSelected"
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
