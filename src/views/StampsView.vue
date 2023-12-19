<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
  import type { Stamp } from '@/models/Stamp'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import StampCard from '@/components/display/StampCard.vue'
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
  import ImagePreviewCellRenderer from '@/components/renderers/ImagePreviewCellRenderer.vue'
  import { preferenceStore } from '@/stores/PreferenceStore'

  const route = useRoute()
  const dataGridRef = ref()
  const store = stampStore()
  const prefStore = preferenceStore()

  const stampView = ref()
  const cardLayout = ref()
  const buttonToolbar = ref()
  const footer = ref()

  const pagingInfo = ref({
    active: 0,
    total: 0,
    size: 1000
  })
  const collection = reactive({
    list: new Array<Stamp>(),
    total: 0,
    selected: new Array<Stamp>(),
    pagingInfo: {
      current: 1,
      limit: 1000,
      start: 0,
      end: 0
    }
  })

  const viewDef = ref({
    mode: 'list'
  })

  const prefPaths = ref({
    imagePath: '/',
    thumbPath: '/'
  })

  const columnDefs = [
    new ColumnDefinition('', {
      cellRenderer: ImagePreviewCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].img',
        prefs: prefPaths.value
      },
      cellClass: ['!p-0.75'],
      maxWidth: 40
    }),
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
      headerName: 'Catalogue Number',
      maxWidth: 150
    }),
    new ColumnDefinition('activeCatalogueNumber.value', {
      cellRenderer: CatalogueValueCellRenderer,
      headerName: 'Catalogue Value',
      maxWidth: 150
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
      headerName: 'Condition',
      maxWidth: 170
    }),
    new ColumnDefinition('', {
      cellRenderer: GradeCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].grade'
      },
      headerName: 'Grade',
      maxWidth: 170
    }),
    new ColumnDefinition('', {
      cellRenderer: PricePaidCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0]'
      },
      headerName: 'Price Paid',
      maxWidth: 150
    })
  ]

  const startingCount = computed(() => {
    return pagingInfo.value.active * pagingInfo.value.size + 1
  })

  const endingCount = computed(() => {
    return pagingInfo.value.active * pagingInfo.value.size + collection.list.length
  })

  const setSelected = (stamp: Stamp) => {
    const indx = collection.selected.findIndex((s) => s.id === stamp.id)
    if (indx < 0) {
      collection.selected.push(stamp)
    }
  }

  const setDeselected = (stamp: Stamp) => {
    const indx = collection.selected.findIndex((s) => s.id === stamp.id)
    if (indx >= 0) {
      collection.selected.splice(indx, 1)
    }
  }

  const calculatePageStats = () => {
    collection.total = store.getCount()
    pagingInfo.value.total = collection.total / /*$top*/ pagingInfo.value.size + 1
    pagingInfo.value.active = /*$skip*/ 0 / /*$top*/ pagingInfo.value.size
  }

  const setView = async (viewType: string): Promise<void> => {
    viewDef.value.mode = viewType
  }

  const isSelected = (stamp: Stamp): boolean => {
    return collection.selected.findIndex((s) => s.id === stamp.id) >= 0
  }
  const getSelectedCardClasses = (stamp: Stamp): string => {
    return collection.selected.includes(stamp)
      ? 'border-[var(--vf-link-color)] border-2 shadow-md bg-[#e6f8f5]'
      : ''
  }

  onUnmounted(() => {
    //resizeObserver.disconnect()
  })

  onMounted(async () => {
    dataGridRef.value.loadingStarted()

    const thumbPref = await prefStore.findByNameAndCategory('thumbPath', 'stamps')
    const imagePref = await prefStore.findByNameAndCategory('imagePath', 'stamps')
    prefPaths.value.thumbPath = thumbPref.value ?? '/'
    prefPaths.value.imagePath = imagePref.value ?? '/'

    const query = route.query
    collection.list = await store.find(query)
    calculatePageStats()
  })
</script>
<template>
  <div class="col-start-2 col-end-6 flex p-2 pr-0 flex-grow h-full overflow-y-auto" ref="stampView">
    <div class="flex-grow flex-auto flex flex-col h-full">
      <div class="flex mb-1" ref="buttonToolbar">
        <SecondaryButton
          class="mr-1 px-0.5"
          icon="sw-icon-gridview"
          @click="setView('card')"
          :disabled="viewDef.mode === 'card'"
        ></SecondaryButton>
        <SecondaryButton
          class="px-0.5"
          icon="sw-icon-list"
          @click="setView('list')"
          :disabled="viewDef.mode === 'list'"
        ></SecondaryButton>
      </div>
      <div class="h-full w-full" v-if="viewDef.mode === 'list'">
        <DataGridComponent
          ref="dataGridRef"
          :columnDefs="columnDefs"
          :multi-select="true"
          :rowData="collection.list"
          :selected-data="collection.selected"
          @selected="setSelected"
          @deselected="setDeselected"
        >
        </DataGridComponent>
      </div>
      <div
        class="flex-grow flex flex-grow-0 flex-shrink-0 flex-row flex-auto max-h-[40rem]"
        v-if="viewDef.mode === 'card'"
        ref="cardLayout"
      >
        <div class="flex flex-wrap flex-grow h-full flex-row overflow-y-auto">
          <template v-for="stamp in collection.list" :key="stamp.id">
            <stamp-card
              :class="`stampcard m-2 ml-0 mb-0 border bg-[#f3f4f6] border-gray-300 rounded-md h-[12rem] w-[12rem]
          brightness-100 hover:brightness-95 ${getSelectedCardClasses(stamp)}`"
              :stamp="stamp"
              :pref-paths="prefPaths"
              :is-selected="isSelected(stamp)"
              path="stampOwnerships[0].img"
              @selected="setSelected"
              @deselected="setDeselected"
            ></stamp-card>
          </template>
        </div>
      </div>

      <div class="flex mb-1 ml-auto mt-1" ref="footer">
        <display-stats
          :start="startingCount"
          :end="endingCount"
          :total="collection.total"
          :selected="collection.selected.length"
        ></display-stats>
      </div>
    </div>
  </div>
</template>
<style></style>
