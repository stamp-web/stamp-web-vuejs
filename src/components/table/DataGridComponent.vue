<script setup lang="ts" generic="T extends PersistedModel">
  import { ref, watch, nextTick, onMounted, onBeforeUnmount, onUpdated } from 'vue'
  import { AgGridVue } from 'ag-grid-vue3'
  import {
    RowNode,
    type ColDef,
    type SortChangedEvent,
    type GridReadyEvent,
    type RowSelectionOptions
  } from 'ag-grid-community'
  import '../../../node_modules/ag-grid-community/styles/ag-grid.css'
  import '../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css'

  import type { PersistedModel } from '@/models/entityModels'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import { isNil } from '@/util/object-utils'

  import type { KeyIndexable } from '@/util/ts/key-accessor'

  const gridApi = ref()
  const gridEl = ref()
  const loading = ref(false)
  const dataLoadTime = ref(0)

  const props = defineProps({
    rowData: Array<T>,
    columnDefs: Array<ColumnDefinition>,
    multiSelect: Boolean,
    columnVisibility: {},
    selectedData: Array<T>
  })
  const emit = defineEmits(['selected', 'deselected', 'sortChanged'])

  const columns = Object.assign([] as ColDef[], props.columnDefs as ColumnDefinition[])

  const rowSelection = {
    mode: 'singleRow',
    enableClickSelection: true,
    checkboxes: false
  } as RowSelectionOptions

  const allowSelectionEvent = ref(true)

  watch(
    () => [[props.columnVisibility]],
    async () => {
      if (!isNil(gridApi.value)) {
        const obj = props.columnVisibility as KeyIndexable
        gridApi.value.setColumnsVisible(
          Object.keys(obj).filter((key) => obj[key] === true),
          true
        )
        gridApi.value.setColumnsVisible(
          Object.keys(obj).filter((key) => obj[key] === false),
          false
        )
        await nextTick()
        resizeColumns()
      }
    },
    { deep: true }
  )

  let timer: NodeJS.Timeout

  watch(
    () => props.rowData,
    async () => {
      if (!isNil(gridApi.value)) {
        clearTimeout(timer)
        // we require to set this to false with rowData being set
        allowSelectionEvent.value = false
        // TODO: check whether we should be using setRowData or not
        gridApi.value.setGridOption('rowData', props.rowData)
        dataLoadTime.value = new Date().getTime()
        timer = setTimeout(() => {
          setSelected(props.selectedData ?? new Array<T>())
        }, 250)
      }
    },
    { deep: true }
  )

  watch(
    () => [[props.selectedData]],
    async () => {
      if (!isNil(gridApi.value)) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          setSelected(props.selectedData ?? new Array<T>())
        }, 250)
      }
    },
    { deep: true }
  )

  watch(
    () => [[loading.value]],
    () => {
      if (!isNil(gridApi.value)) {
        if (loading.value) {
          gridApi.value.setGridOption('loading', true)
        } else {
          gridApi.value.setGridOption('loading', false)
        }
      }
    },
    { deep: true }
  )

  const setSelected = async (selected: Array<T>) => {
    if (selected) {
      let leastIndex = -1
      const selectedNodes = new Array<RowNode<T>>()
      allowSelectionEvent.value = false
      // Since this could be debounced called, the grid may be in the process of being destroyed
      if (!gridApi.value.isDestroyed()) {
        if (selected.length > 0) {
          const lastSelected = selected[selected.length - 1]
          gridApi.value.forEachNode((node: RowNode<T>) => {
            if (selected.find((d) => d.id === node.data?.id)) {
              if (lastSelected.id === node.data?.id && node.rowIndex) {
                leastIndex = node.rowIndex
              }
              selectedNodes.push(node)
            }
          })
        }
        //gridApi.value.deselectAll()
        gridApi.value.setNodesSelected({ nodes: selectedNodes, newValue: true })
        if (leastIndex >= 0 && leastIndex < gridApi.value.getDisplayedRowCount()) {
          // will scroll to selection if  the time between setting the data is greater than
          // 125ms so it doesn't scroll on individual selections (only on data reload)
          const placement = new Date().getTime() - dataLoadTime.value < 125 ? 'middle' : null
          gridApi.value.ensureIndexVisible(leastIndex, placement)
        }
      }
      allowSelectionEvent.value = true
    }
  }

  const observer = new ResizeObserver(() => {
    resizeColumns()
  })

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.value = params.api
    if (loading.value) {
      gridApi.value.setGridOption('loading', false)
    }
    resizeColumns()
    clearTimeout(timer)
    timer = setTimeout(() => {
      setSelected(props.selectedData ?? new Array<T>())
    }, 250)
  }

  const onSelected = (event: object) => {
    // @ts-expect-error - grid event
    const selected = event.node?.data
    // @ts-expect-error - grid event
    const isSelected = event.node?.isSelected()
    if (selected && allowSelectionEvent.value) {
      emit(isSelected ? 'selected' : 'deselected', selected)
    }
  }

  const onSortChanged = (event: SortChangedEvent<unknown>) => {
    emit(
      'sortChanged',
      event.api.getColumnState().find((col) => col.sort)
    )
  }

  const resizeColumns = async () => {
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
    rowSelection.mode = props.multiSelect ? 'multiRow' : 'singleRow'
    if (props.multiSelect) {
      // @ts-expect-error: row selection may not have a checkbox depending on grid
      rowSelection.headerCheckbox = false
    }
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
    style="width: 100%; height: 100%"
    :class="`ag-theme-stamp-web flex-shrink flex-auto flex-grow min-h-[5rem] grid-loading-${loading}`"
    :columnDefs="columns"
    :rowData="props.rowData"
    :rowSelection="rowSelection"
    :rowHeight="36"
    @sortChanged="onSortChanged"
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
      --ag-header-height: 28px,
      --ag-foreground-color: #374151,
      --ag-selected-row-background-color: #ecfdf5,
      //--ag-header-foreground-color: #ffffff,
      --ag-header-background-color: #e5e7eb,
      --ag-range-selection-border-color: transparent,
      //--ag-header-cell-hover-background-color: #374151
    )
  );
</style>
