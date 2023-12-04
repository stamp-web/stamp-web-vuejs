<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { computed, onMounted, reactive, ref } from 'vue'
  import type { Stamp } from '@/models/Stamp'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import { stampStore } from '@/stores/stampStore'
  import CountryCellRenderer from '@/components/renderers/CountryCellRenderer.vue'
  import StampDescriptionCellRenderer from '@/components/renderers/StampDescriptionCellRenderer.vue'
  import CatalogueValueCellRenderer from '@/components/renderers/CatalogueValueCellRenderer.vue'
  import ConditionCellRenderer from '@/components/renderers/ConditionCellRenderer.vue'
  import GradeCellRenderer from '@/components/renderers/GradeCellRenderer.vue'
  import PricePaidCellRenderer from '@/components/renderers/PricePaidCellRenderer.vue'
  import NotesCellRenderer from '@/components/renderers/NotesCellRenderer.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import DisplayStats from '@/components/display/DisplayStats.vue'

  const route = useRoute()
  const dataGridRef = ref()
  const store = stampStore()

  const pagingInfo = ref({
    active: 0,
    total: 0,
    size: 1000
  })
  const collection = reactive({
    list: new Array<Stamp>(),
    total: 0,
    selected: {} as Stamp,
    pagingInfo: {
      current: 1,
      limit: 1000,
      start: 0,
      end: 0
    }
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
    new ColumnDefinition(
      '',
      Object.assign(
        {
          cellRenderer: NotesCellRenderer,
          cellRendererParams: {
            path: 'stampOwnerships[0]'
          },
          headerName: 'Notes'
        },
        ColumnDefinition.getActionIconProperties()
      )
    ),
    new ColumnDefinition('', {
      cellRenderer: ConditionCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].condition'
      },
      headerName: 'Condition'
    }),
    new ColumnDefinition('', {
      cellRenderer: GradeCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].grade'
      },
      headerName: 'Grade'
    }),
    new ColumnDefinition('', {
      cellRenderer: PricePaidCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0]'
      },
      headerName: 'Price Paid'
    })
  ]

  const startingCount = computed(() => {
    return pagingInfo.value.active * pagingInfo.value.size + 1
  })

  const endingCount = computed(() => {
    return pagingInfo.value.active * pagingInfo.value.size + collection.list.length
  })

  const setSelected = (stamp: Stamp) => {
    collection.selected = stamp
  }

  const calculatePageStats = () => {
    collection.total = store.getCount()
    pagingInfo.value.total = collection.total / /*$top*/ pagingInfo.value.size + 1
    pagingInfo.value.active = /*$skip*/ 0 / /*$top*/ pagingInfo.value.size
  }

  onMounted(async () => {
    dataGridRef.value.loadingStarted()
    const query = route.query
    collection.list = await store.find(query)
    calculatePageStats()
  })
</script>
<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row">
    <div class="flex-grow flex-auto flex flex-col">
      <div class="flex mb-1">
        <SecondaryButton icon="sw-icon-gridview" disabled></SecondaryButton>
        <SecondaryButton icon="sw-icon-list" disabled></SecondaryButton>
      </div>
      <DataGridComponent
        class=""
        ref="dataGridRef"
        :columnDefs="columnDefs"
        :rowData="collection.list"
        @selected="setSelected"
      >
      </DataGridComponent>
      <div class="flex mb-1 ml-auto">
        <display-stats
          :start="startingCount"
          :end="endingCount"
          :total="collection.total"
        ></display-stats>
      </div>
    </div>
  </div>
</template>
