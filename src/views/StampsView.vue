<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { Stamp } from '@/models/Stamp'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import PagingComponent from '@/components/table/PagingComponent.vue'
  import StampCard from '@/components/display/StampCard.vue'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import { stampStore } from '@/stores/stampStore'
  import CountryCellRenderer from '@/components/renderers/CountryCellRenderer.vue'
  import CatalogueValueCellRenderer from '@/components/renderers/CatalogueValueCellRenderer.vue'
  import ConditionCellRenderer from '@/components/renderers/ConditionCellRenderer.vue'
  import GradeCellRenderer from '@/components/renderers/GradeCellRenderer.vue'
  import PricePaidCellRenderer from '@/components/renderers/PricePaidCellRenderer.vue'
  import NotesCellRenderer from '@/components/renderers/NotesCellRenderer.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import DisplayStats from '@/components/display/DisplayStats.vue'
  import ImagePreviewCellRenderer from '@/components/renderers/ImagePreviewCellRenderer.vue'
  import { preferenceStore } from '@/stores/PreferenceStore'
  import stampSelectableCollection from '@/components/behaviors/stampSelectableCollection'
  import pagingInfo from '@/components/behaviors/pageInfo'
  import { OdataUtil } from '@/util/odata-util'
  import BasicCellValueRenderer from '@/components/renderers/BasicCellValueRenderer.vue'
  import PagingSizeInput from '@/components/inputs/PagingSizeInput.vue'

  const { t } = useI18n()

  const route = useRoute()
  const dataGridRef = ref()
  const store = stampStore()
  const prefStore = preferenceStore()
  const query = ref({
    $skip: 1000,
    $top: 0,
    $filter: '',
    $orderby: ''
  })
  const stampView = ref()
  const cardLayout = ref()
  const buttonToolbar = ref()
  const footer = ref()

  const collection = reactive({
    list: new Array<Stamp>(),
    total: 0,
    selected: new Array<Stamp>()
  })

  const { areAllSelected, areNoneSelected, isSelected, selectAll, setSelected, setDeselected } =
    stampSelectableCollection(collection.list, collection.selected)

  const {
    endingCount,
    startingCount,
    calculatePagingStats,
    setActivePage,
    setPageSize,
    setItemList,
    getPageSize,
    getActivePage,
    getPageCount
  } = pagingInfo('stamps.pagingInfo')

  const viewDef = ref({
    mode: 'list'
  })

  const prefPaths = ref({
    imagePath: '/',
    thumbPath: '/'
  })

  const noSort = () => {
    return 0
  }

  const columnDefs = [
    new ColumnDefinition('', {
      cellRenderer: ImagePreviewCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].img',
        prefs: prefPaths.value
      },
      cellClass: ['!p-0.75'],
      maxWidth: 40,
      sortable: false
    }),
    new ColumnDefinition('countryRef', {
      cellClass: ['!pr-0.25'],
      cellRenderer: CountryCellRenderer,
      headerName: t('table-columns.country'),
      sortable: false
    }),
    new ColumnDefinition('rate', {
      cellClass: ['!pr-0.25'],
      headerName: t('table-columns.rate'),
      maxWidth: 150,
      sortable: true
    }),
    new ColumnDefinition('description', {
      cellClass: ['!pr-0.25'],
      colId: 'description',
      headerName: t('table-columns.description'),
      sortable: true,
      cellRenderer: BasicCellValueRenderer
    }),
    new ColumnDefinition('activeCatalogueNumber.number', {
      cellClass: ['!pr-0.25'],
      colId: 'number',
      comparator: noSort,
      headerName: t('table-columns.catalogue-number'),
      maxWidth: 150,
      sort: 'asc',
      sortable: true
    }),
    new ColumnDefinition('activeCatalogueNumber.value', {
      cellClass: ['!pr-0.25'],
      cellRenderer: CatalogueValueCellRenderer,
      colId: 'value',
      headerName: t('table-columns.catalogue-value'),
      maxWidth: 150,
      sortable: true
    }),
    new ColumnDefinition(
      '',
      Object.assign(ColumnDefinition.getActionIconProperties(), {
        cellRenderer: NotesCellRenderer,
        cellRendererParams: {
          path: 'stampOwnerships[0]'
        },
        headerName: t('table-columns.notes'),
        sortable: false
      })
    ),
    new ColumnDefinition('', {
      cellClass: ['!pr-0.25'],
      cellRenderer: ConditionCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].condition'
      },
      colId: 'condition',
      headerName: t('table-columns.condition'),
      maxWidth: 170,
      sortable: true
    }),
    new ColumnDefinition('', {
      cellClass: ['!pr-0.25'],
      cellRenderer: GradeCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].grade'
      },
      colId: 'grade',
      headerName: t('table-columns.grade'),
      maxWidth: 170,
      sortable: true
    }),
    new ColumnDefinition('', {
      cellClass: ['!pr-0.25'],
      colId: 'pricePaid',
      cellRenderer: PricePaidCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0]'
      },
      headerName: t('table-columns.price-paid'),
      maxWidth: 150
    })
  ]

  const setupStats = () => {
    collection.total = store.getCount()
    calculatePagingStats(collection.total)
  }

  const setView = async (viewType: string): Promise<void> => {
    viewDef.value.mode = viewType
  }

  const getSelectedCardClasses = (stamp: Stamp): string => {
    return isSelected(stamp)
      ? '!border-[var(--vf-link-color)] border-2 shadow-md !bg-[#e6f8f5]'
      : ''
  }

  const onSortChanged = (columnDef: any) => {
    if (columnDef?.sort) {
      query.value.$orderby = OdataUtil.createSort(columnDef.colId, columnDef.sort)
    }
    gotoPage(1)
  }

  const findWithQuery = async (theQuery: any) => {
    const results = await store.find(theQuery)
    collection.list = [] //.splice(0, collection.list.length)
    await nextTick()
    collection.list = results
    setItemList(collection.list)
    setupStats()
  }

  const gotoPage = (page: number) => {
    setActivePage(page)
    setQueryPagingParams((getActivePage() - 1) * getPageSize(), getPageSize())
    findWithQuery(query.value)
  }

  const setQueryPagingParams = (skip: number, size: number) => {
    query.value.$top = size
    query.value.$skip = skip
  }

  const pageSizeChanges = (pageSize: number) => {
    if (getPageSize() !== pageSize) {
      setPageSize(pageSize)
      gotoPage(1)
    }
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

    // @ts-ignore
    query.value = {
      ...structuredClone(route.query)
    }
    query.value.$orderby = OdataUtil.createSort('number', 'asc')
    gotoPage(1)
  })
</script>
<template>
  <div
    class="col-start-2 col-end-6 flex p-2 pr-0 flex-grow h-full overflow-y-hidden"
    ref="stampView"
  >
    <div class="flex-grow flex-auto flex flex-col h-full overflow-y-hidden">
      <div class="flex mb-1 h-[32.5px]" ref="buttonToolbar">
        <SecondaryButton
          class="mr-1 px-0.5"
          icon="sw-icon-list"
          :tooltip="viewDef.mode === 'list' ? '' : t('actions.show-list-view')"
          @click="setView('list')"
          :disabled="viewDef.mode === 'list'"
        ></SecondaryButton>
        <SecondaryButton
          class="mr-1 px-0.5"
          icon="sw-icon-gridview"
          :tooltip="viewDef.mode === 'card' ? '' : t('actions.show-card-view')"
          @click="setView('card')"
          :disabled="viewDef.mode === 'card'"
        ></SecondaryButton>
        <SecondaryButton
          class="mr-1 px-0.5"
          icon="sw-icon-select-all"
          :tooltip="areAllSelected() ? '' : t('actions.select-all')"
          @click="selectAll()"
          :disabled="areAllSelected()"
        ></SecondaryButton>
        <SecondaryButton
          class="px-0.5"
          icon="sw-icon-clear-all"
          :tooltip="areNoneSelected() ? '' : t('actions.clear-selection')"
          @click="selectAll(false)"
          :disabled="areNoneSelected()"
        ></SecondaryButton>
        <PagingSizeInput
          class="ml-auto mr-2 scale-90 hidden md:block"
          @page-size-changed="pageSizeChanges"
          :label="t('form.page-size')"
          :page-size="getPageSize()"
        ></PagingSizeInput>
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
          @sortChanged="onSortChanged"
        >
        </DataGridComponent>
      </div>
      <div
        class="flex-grow flex flex-grow-0 flex-shrink-0 flex-row flex-auto overflow-y-auto max-h-[calc(100%_-_65px)] min-h-[calc(100%_-_65px)] border border-gray-300"
        v-if="viewDef.mode === 'card'"
        ref="cardLayout"
      >
        <div class="flex flex-wrap flex-grow h-full flex-row overflow-y-auto pt-1 pl-1">
          <template v-for="stamp in collection.list" :key="stamp.id">
            <stamp-card
              :class="`stampcard m-1 border bg-[#f3f4f6] border-gray-300 rounded-md h-[12rem] w-[12rem]
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

      <div class="flex mb-1 mt-1 h-[22.5px]" ref="footer">
        <paging-component
          class="mr-auto"
          :total-pages="getPageCount()"
          :page-num="getActivePage()"
          @first="gotoPage(1)"
          @back="gotoPage(getActivePage() - 1)"
          @next="gotoPage(getActivePage() + 1)"
          @last="gotoPage(getPageCount())"
        >
        </paging-component>
        <display-stats
          class="mr-1"
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
