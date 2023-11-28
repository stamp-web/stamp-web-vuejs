<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { onMounted, reactive, ref } from 'vue'
  import type { Stamp } from '@/models/Stamp'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import { stampStore } from '@/stores/stampStore'
  import CountryCellRenderer from '@/components/renderers/CountryCellRenderer.vue'
  import StampDescriptionCellRenderer from '@/components/renderers/StampDescriptionCellRenderer.vue'
  import CatalogueValueCellRenderer from '@/components/renderers/CatalogueValueCellRenderer.vue'
  import ConditionCellRenderer from '@/components/renderers/ConditionCellRenderer.vue'

  const route = useRoute()
  const dataGridRef = ref()
  const store = stampStore()

  const collection = reactive({
    list: new Array<Stamp>(),
    selected: {} as Stamp
  })

  const columnDefs = [
    new ColumnDefinition('countryRef', {
      cellRenderer: CountryCellRenderer,
      headerName: 'Country'
    }),
    new ColumnDefinition('description', {
      sort: 'asc',
      cellRenderer: StampDescriptionCellRenderer,
      headerName: 'Description'
    }),
    new ColumnDefinition('activeCatalogueNumber.number', {
      headerName: 'Catalogue Number'
    }),
    new ColumnDefinition('activeCatalogueNumber.value', {
      cellRenderer: CatalogueValueCellRenderer,
      headerName: 'Catalogue Value'
    }),
    new ColumnDefinition('', {
      cellRenderer: ConditionCellRenderer,
      headerName: 'Condition',
      cellRendererParams: {
        path: 'stampOwnerships[0].condition'
      }
    })
  ]

  const setSelected = (stamp: Stamp) => {
    collection.selected = stamp
  }

  onMounted(async () => {
    dataGridRef.value.loadingStarted()
    collection.list = await store.find(route.query)
  })
</script>
<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row">
    <div class="flex-grow flex-auto flex flex-col">
      <div class="flex mb-1">
        <!-- toolbar -->
        Stamps {{ route.query }}
      </div>
      <DataGridComponent
        class=""
        ref="dataGridRef"
        :columnDefs="columnDefs"
        :rowData="collection.list"
        @selected="setSelected"
      >
      </DataGridComponent>
    </div>
  </div>
</template>
