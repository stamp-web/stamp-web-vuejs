<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed, inject, nextTick, onMounted, onUnmounted, ref, toRaw, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TransitionRoot, PopoverPanel, Popover, PopoverButton } from '@headlessui/vue'
  import _isEmpty from 'lodash-es/isEmpty'
  import { Parser, Operators, Predicate } from 'odata-filter-parser'
  import type { Log } from 'vuejs3-logger'
  import dayjs from 'dayjs'

  import editableModel from '@/components/behaviors/editableModel'
  import stampSelectableCollection from '@/components/behaviors/stampSelectableCollection'
  import stampFilters from '@/components/behaviors/stampFilters'
  import StampDeleteDialog from '@/components/dialogs/DeleteStampDialog.vue'
  import StampPurchaseDialog from '@/components/dialogs/StampPurchaseDialog.vue'
  import StampBulkEditDialog from '@/components/dialogs/StampBulkEditDialog.vue'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import PagingComponent from '@/components/table/PagingComponent.vue'
  import StampCard from '@/components/display/StampCard.vue'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import CountryCellRenderer from '@/components/renderers/CountryCellRenderer.vue'
  import CatalogueValueCellRenderer from '@/components/renderers/CatalogueValueCellRenderer.vue'
  import ConditionCellRenderer from '@/components/renderers/ConditionCellRenderer.vue'
  import GradeCellRenderer from '@/components/renderers/GradeCellRenderer.vue'
  import PricePaidCellRenderer from '@/components/renderers/PricePaidCellRenderer.vue'
  import NotesCellRenderer from '@/components/renderers/NotesCellRenderer.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import DisplayStats from '@/components/display/DisplayStats.vue'
  import StampReportValues from '@/components/display/StampReportValues.vue'
  import ImagePreviewCellRenderer from '@/components/renderers/ImagePreviewCellRenderer.vue'
  import CertCellRenderer from '@/components/renderers/CertCellRenderer.vue'
  import pagingInfo from '@/components/behaviors/pageInfo'
  import BasicCellValueRenderer from '@/components/renderers/BasicCellValueRenderer.vue'
  import PagingSizeInput from '@/components/inputs/PagingSizeInput.vue'
  import FilterInput from '@/components/inputs/FilterInput.vue'
  import ConditionFilterInput from '@/components/inputs/ConditionFilterInput.vue'

  import StampEditor from '@/components/editors/StampEditor.vue'

  import { Prompt } from '@/components/Prompt'

  import { type Stamp, StampModelHelper } from '@/models/Stamp'
  import { OwnershipHelper } from '@/models/Ownership'
  import { ReportType } from '@/models/ReportType'
  import { StampModelUtils } from '@/models/StampModelUtils'
  import { ReportResult } from '@/models/ReportResult'
  import { CurrencyTools } from '@/models/CurrencyCode'

  import reportService from '@/services/ReportService'

  import { preferenceStore } from '@/stores/PreferenceStore'
  import { countryStore } from '@/stores/countryStore'
  import { stampStore } from '@/stores/stampStore'
  import LocalCache from '@/stores/LocalCache'

  import type { KeyIndexable } from '@/util/ts/key-accessor'
  import { extractErrorMessage } from '@/util/object-utils'
  import { PredicateUtilities } from '@/util/predicate-util'
  import { OdataUtil } from '@/util/odata-util'
  import WantListFilterInput from '@/components/inputs/WantListFilterInput.vue'
  import SearchForm from '@/components/forms/SearchForm.vue'

  const { t } = useI18n()

  const logger = inject('vuejs3-logger') as Log

  const route = useRoute()
  const router = useRouter()

  const dataGridRef = ref()
  const columnControl = ref({
    cert: true,
    grade: true,
    notes: true,
    pricePaid: true
  })
  const store = stampStore()
  const countriesStore = countryStore()
  const prefStore = preferenceStore()
  const query = ref({
    $skip: 1000,
    $top: 0,
    $filter: '',
    $orderby: ''
  })

  const state = ref({
    predicates: new Array<Predicate>(),
    filterPredicates: new Array<Predicate>(),
    condition: 'All',
    filterText: '',
    wantList: 'All'
  })

  const purchaseModel = ref({
    show: false,
    stamps: new Array<Stamp>()
  })

  const deleteModel = ref({
    showDelete: false,
    deletingStamps: new Array<Stamp>()
  })

  const bulkEditModel = ref({
    show: false,
    progress: false,
    stamps: new Array<Stamp>()
  })

  const stampView = ref()
  const cardLayout = ref()
  const buttonToolbar = ref()
  const footer = ref()
  const reporting = ref({
    reportType: ReportType.CatalogueValue,
    reportValue: '0.0'
  })

  const {
    areAllSelected,
    areNoneSelected,
    isSelected,
    selectAll,
    setSelected,
    setDeselected,
    getCurrentSelected,
    getCollectionTotal,
    setCollectionTotal,
    getCollection,
    setCollection,
    isCollectionEmpty,
    removeCollectionEntries,
    updateCollectionEntry
  } = stampSelectableCollection()

  const { conditionChanged, descriptionChanged, wantListChanged, parseQueryFilter } = stampFilters

  const {
    endingCount,
    startingCount,
    calculatePagingStats,
    setActivePage,
    setPageSize,
    setPagingItems,
    getPageSize,
    getActivePage,
    getPageCount
  } = pagingInfo('stamps.pagingInfo')

  const { isEditorShown, setEditModel, getEditModel, hideEditor } = editableModel<Stamp>()

  const viewDef = ref({
    mode: 'list'
  })

  const prefPaths = ref({
    imagePath: '/',
    thumbPath: '/'
  })

  const stampModelUtils = new StampModelUtils()

  const noSort = () => {
    return 0
  }

  const transformEditModel = (m: any) => {
    if (m.stampOwnerships?.length > 0) {
      OwnershipHelper.toTagElementView(m.stampOwnerships[0])
    }
    setEditModel(m)
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
    ColumnDefinition.createActionIconColumn('sw-icon-edit', transformEditModel, t('actions.edit')),
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
        colId: 'notes',
        maxWidth: 24,
        minWidth: 24,
        sortable: false
      })
    ),
    new ColumnDefinition(
      '',
      Object.assign(ColumnDefinition.getActionIconProperties(), {
        cellRenderer: CertCellRenderer,
        cellRendererParams: {
          path: 'stampOwnerships[0]'
        },
        colId: 'cert',
        maxWidth: 24,
        minWidth: 24,
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

  watch(
    () => [isEditorShown()],
    () => {
      Object.keys(columnControl.value).forEach((key) => {
        ;(columnControl.value as KeyIndexable)[key] = !isEditorShown()
      })
    }
  )

  const isSelectedWantlist = computed((): boolean => {
    return getEditModel()?.wantList
  })

  const calculateEditorWidth = () => {
    return isSelectedWantlist.value ? 'min-w-80 max-w-80' : 'min-w-160 max-w-160'
  }

  const setupStats = async () => {
    await nextTick()
    setPagingItems(getCollection())
    setCollectionTotal(store.getCount())
    calculatePagingStats(getCollectionTotal())
  }

  const setView = (viewType: string) => {
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
    } else if (query.value.$orderby) {
      // @ts-ignore
      delete query.value.$orderby
    }
    gotoPage(1)
  }

  const findWithQuery = async (theQuery: any) => {
    logger.info('query info', query.value)
    const results = await store.find(theQuery)
    setCollection(results, true)
    fetchReportData()
    return await setupStats()
  }

  const gotoPage = async (page: number) => {
    setActivePage(page)
    setQueryPagingParams(Math.max((getActivePage() - 1) * getPageSize(), 0), getPageSize())
    query.value.$filter = PredicateUtilities.concat(
      Operators.AND,
      state.value.predicates.concat(state.value.filterPredicates)
    ).serialize()
    return findWithQuery(query.value)
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

  const fetchReportData = async () => {
    reporting.value.reportValue = t('messages.calculating')
    const result: ReportResult = await reportService.executeReport(
      reporting.value.reportType,
      query.value
    )
    reporting.value.reportValue = CurrencyTools.asCurrencyString(result.value, result.code)
  }

  const changeReportType = async (value: string) => {
    reporting.value.reportType = Number.parseInt(value)
    await fetchReportData()
  }

  const print = () => {}

  const purchase = () => {
    purchaseModel.value.stamps = getCurrentSelected().slice()
    purchaseModel.value.show = true
  }

  const bulkEdit = () => {
    bulkEditModel.value.stamps = getCurrentSelected().slice()
    bulkEditModel.value.show = true
  }

  const deleteSelected = () => {
    deleteModel.value.deletingStamps = getCurrentSelected().slice()
    deleteModel.value.showDelete = true
  }

  const processDelete = async (stamps: Array<Stamp>) => {
    if (stamps && stamps.length > 0) {
      const toUpdate = new Array<Stamp>()
      const promises = new Array<Promise<any>>()
      stamps.forEach((s) => {
        toUpdate.push(s)
        promises.push(store.remove(s))
      })
      Promise.all(promises).then(async () => {
        await removeCollectionEntries(toUpdate)
        await setupStats()
      })
    }
    deleteModel.value.showDelete = false
  }

  const processPurchase = (processed: boolean = false) => {
    purchaseModel.value.show = false
    if (processed) {
      gotoPage(getActivePage())
    }
  }

  const processBulkEdit = async (bulkEdit: boolean = false, values: Record<string, any>) => {
    if (bulkEdit) {
      const selectedStamps = getCurrentSelected().slice()
      if (selectedStamps && selectedStamps.length > 0) {
        bulkEditModel.value.progress = true
        await Promise.all(stampModelUtils.bulkEditStamps(selectedStamps, values))
        await gotoPage(getActivePage())
      }
    }
    bulkEditModel.value.progress = false
    bulkEditModel.value.show = false
  }

  const deleteStamp = (s: Stamp) => {
    deleteModel.value.deletingStamps = [s]
    deleteModel.value.showDelete = true
  }

  const wantListFilterChanged = async (wantListFilter: string) => {
    wantListChanged(state.value.filterPredicates, wantListFilter)
    await gotoPage(getActivePage())
  }
  const conditionFilterChanged = async (conditionFilter: string) => {
    conditionChanged(state.value.filterPredicates, conditionFilter)
    await gotoPage(getActivePage())
  }

  const goSearch = async (searchFilter: Predicate) => {
    state.value.predicates = []
    await nextTick()
    state.value.predicates.push(searchFilter)
    await router.push({
      query: {
        $filter: PredicateUtilities.concat(Operators.AND, state.value.predicates).serialize()
      }
    })
    await gotoPage(getActivePage())
  }
  const filterChanged = async (filterText: string) => {
    descriptionChanged(state.value.filterPredicates, filterText)
    await gotoPage(getActivePage())
  }

  const refresh = async () => {
    await gotoPage(getActivePage())
  }

  const createStamp = async (wantList: boolean = false) => {
    const stampPrefs = await prefStore.findByCategory('stamps')
    const model = StampModelHelper.newInstance(wantList, stampPrefs)
    transformEditModel(model)
  }

  const save = async (s: Stamp, saveAndNew: boolean = false) => {
    try {
      const updating = s.id > 0
      const sModified = structuredClone(toRaw(s))
      if (sModified.stampOwnerships?.length > 0) {
        if (!updating && sModified.stampOwnerships[0].purchased) {
          LocalCache.setItem(
            'ownership-purchased',
            dayjs(sModified.stampOwnerships[0].purchased).format('YYYY-MM-DD')
          )
        }
        OwnershipHelper.fromTagElementView(sModified.stampOwnerships[0])
      }
      const savedStamp = updating ? await store.update(sModified) : await store.create(sModified)
      await updateCollectionEntry(savedStamp)
      setupStats()
      if (saveAndNew) {
        createStamp(savedStamp.wantList)
      } else {
        hideEditor()
      }
      // @ts-ignore
    } catch (err: Error) {
      Prompt.alert({
        message: t('messages.save-failure', { message: extractErrorMessage(err) }),
        title: t('titles.save-failure'),
        asHtml: true
      })
    }
  }

  const setupInitialQuery = async () => {
    if (_isEmpty(route.query)) {
      const country = await countriesStore.findRandom()
      if (country) {
        await router.push({ query: { $filter: `(countryRef eq ${country.id})` } })
        state.value.predicates = [
          new Predicate({
            subject: 'countryRef',
            operator: Operators.EQUALS,
            value: `${country.id}`
          })
        ]
      }
    } else {
      // @ts-ignore
      query.value = {
        ...structuredClone(route.query)
      }
      if (query.value.$filter) {
        state.value.predicates = [Parser.parse(query.value.$filter)]
      }
    }
    query.value.$orderby = OdataUtil.createSort('number', 'asc')
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
    await setupInitialQuery()
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
        <PrimaryButton
          class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-24 border rounded-tr-none rounded-br-none border-[var(--vf-primary)] border-r-[var(--vf-color-on-primary)] hidden lg:block"
          icon="sw-icon-plus"
          id="create-stamp"
          :tooltip="t('actions.new-stamp')"
          @click="createStamp()"
          >{{ t('actions.new-stamp') }}</PrimaryButton
        >
        <PrimaryButton
          class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 rounded-none border border-r-[var(--vf-color-on-primary)] border-[var(--vf-primary)] !border-l-transparent hidden lg:block"
          icon="sw-icon-plus"
          id="create-wantList"
          :tooltip="t('actions.new-wantlist')"
          @click="createStamp(true)"
        ></PrimaryButton>
        <Popover class="relative mt-auto">
          <PopoverButton
            class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 focus:outline-none focus:bg-[var(--vf-primary-darker)] !focus-visible:border-transparent rounded-tl-none rounded-bl-none border border-[var(--vf-primary)] !border-l-transparent enabled:bg-[var(--vf-primary)] enabled:text-[var(--vf-color-on-primary)] hover:enabled:bg-[var(--vf-primary-darker)] !disabled:cursor-auto rounded border border-[var(--vf-bg-disabled)]"
            icon="sw-icon-search"
            id="search-stamps"
            :disabled="isEditorShown()"
            :tooltip="t('actions.search')"
            ><i class="sw-icon-search"></i>
          </PopoverButton>
          <PopoverPanel
            v-slot="{ close }"
            class="mt-0.5 w-[24rem] overlow-y-auto flex flex-col max-h-[29rem] p-3 border border-2 border-[var(--vf-primary)] rounded rounded-xl z-999 absolute bg-white shadow-xl"
          >
            <SearchForm
              :close="close"
              @search-options="goSearch"
              :criteria="parseQueryFilter(route.query)"
            ></SearchForm>
          </PopoverPanel>
        </Popover>
        <SecondaryButton
          class="ml-2 !px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 border rounded-tr-none rounded-br-none !border-gray-400"
          icon="sw-icon-list"
          :tooltip="viewDef?.mode === 'list' ? '' : t('actions.show-list-view')"
          @click="setView('list')"
          :disabled="viewDef?.mode === 'list'"
        ></SecondaryButton>
        <SecondaryButton
          class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 rounded-none border !border-gray-400 !border-l-transparent"
          icon="sw-icon-gridview"
          :tooltip="viewDef?.mode === 'card' ? '' : t('actions.show-card-view')"
          @click="setView('card')"
          :disabled="viewDef?.mode === 'card'"
        ></SecondaryButton>
        <SecondaryButton
          class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 rounded-none border !border-gray-400 !border-l-transparent"
          icon="sw-icon-references"
          :tooltip="t('actions.show-reference-catalogueNumbers')"
          @click="setView('card')"
          :disabled="true"
        ></SecondaryButton>
        <SecondaryButton
          class="ml-0 !px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 rounded-tl-none rounded-bl-none border !border-gray-400 !border-l-transparent"
          icon="sw-icon-print"
          :tooltip="t('actions.print')"
          @click="print()"
          :disabled="true"
        ></SecondaryButton>

        <SecondaryButton
          class="ml-2 !px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 border rounded-tr-none rounded-br-none !border-gray-400 hidden lg:block"
          icon="sw-icon-purchased"
          id="btn-purchased"
          :tooltip="areNoneSelected() ? '' : t('actions.purchased')"
          @click="purchase()"
          :disabled="areNoneSelected()"
        ></SecondaryButton>
        <SecondaryButton
          class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 rounded-none border !border-gray-400 !border-l-transparent"
          icon="sw-icon-bulk-edit"
          id="btn-bulk-edit"
          :tooltip="areNoneSelected() ? '' : t('actions.bulk-edit')"
          @click="bulkEdit()"
          :disabled="areNoneSelected()"
        ></SecondaryButton>
        <SecondaryButton
          class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 border rounded-tl-none rounded-bl-none !border-gray-400 !border-l-transparent hidden lg:block"
          icon="sw-icon-delete"
          id="btn-delete"
          :tooltip="areNoneSelected() ? '' : t('actions.delete-selected')"
          @click="deleteSelected()"
          :disabled="areNoneSelected()"
        ></SecondaryButton>
        <SecondaryButton
          class="ml-2 !px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 border rounded-tr-none rounded-br-none !border-gray-400 hidden lg:block"
          icon="sw-icon-select-all"
          id="btn-select-all"
          :tooltip="areAllSelected() ? '' : t('actions.select-all')"
          @click="selectAll()"
          :disabled="isCollectionEmpty()"
        ></SecondaryButton>
        <SecondaryButton
          class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 border rounded-tl-none rounded-bl-none !border-gray-400 !border-l-transparent hidden lg:block"
          icon="sw-icon-clear-all"
          id="btn-clear-selection"
          :tooltip="areNoneSelected() ? '' : t('actions.clear-selection')"
          @click="selectAll(false)"
          :disabled="areNoneSelected()"
        ></SecondaryButton>
        <FilterInput
          class="ml-1 w-56 scale-90 hidden lg:block"
          :label="t('actions.filter')"
          @filter-changed="filterChanged"
        ></FilterInput>
        <WantListFilterInput
          class="scale-90 w-44 hidden xl:block"
          :filter="state.wantList"
          @wantList-filter-changed="wantListFilterChanged"
        >
        </WantListFilterInput>
        <ConditionFilterInput
          class="ml-0 scale-90 w-40 hidden xl:block"
          :condition="state.condition"
          @condition-filter-changed="conditionFilterChanged"
        ></ConditionFilterInput>
        <SecondaryButton
          class="!px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 border !border-gray-400 hidden xl:block"
          icon="sw-icon-refresh"
          id="btn-refresh"
          :tooltip="t('actions.refresh')"
          @click="refresh()"
        ></SecondaryButton>
        <PagingSizeInput
          class="ml-auto mr-2 scale-90 hidden md:block"
          @page-size-changed="pageSizeChanges"
          :label="t('form.page-size')"
          :page-size="getPageSize()"
        ></PagingSizeInput>
      </div>
      <div class="h-full w-full flex overflow-hidden">
        <div class="h-full w-full" v-if="viewDef.mode === 'list'">
          <DataGridComponent
            ref="dataGridRef"
            :columnDefs="columnDefs"
            :columnVisibility="columnControl"
            :multi-select="true"
            :rowData="getCollection()"
            :selected-data="getCurrentSelected()"
            @selected="setSelected"
            @deselected="setDeselected"
            @sortChanged="onSortChanged"
          >
          </DataGridComponent>
        </div>
        <div
          class="flex-grow flex flex-grow-0 flex-shrink-1 flex-row flex-auto w-full overflow-y-auto border border-gray-300"
          v-if="viewDef.mode === 'card'"
          ref="cardLayout"
        >
          <div
            class="flex flex-wrap content-start flex-grow h-full flex-row overflow-y-auto pt-1 pl-1"
          >
            <template v-for="stamp in getCollection()" :key="stamp.id">
              <stamp-card
                :class="`stampcard m-1 border bg-[#f3f4f6] border-gray-300 rounded-md h-[12rem] w-[12rem]
          brightness-100 hover:brightness-95 ${getSelectedCardClasses(stamp)}`"
                :stamp="stamp"
                :pref-paths="prefPaths"
                :is-selected="isSelected(stamp)"
                path="stampOwnerships[0].img"
                @selected="setSelected"
                @deselected="setDeselected"
                @edit-stamp="setEditModel"
                @delete-stamp="deleteStamp"
              ></stamp-card>
            </template>
          </div>
        </div>
        <TransitionRoot
          :show="isEditorShown()"
          enter="transition-opacity duration-75"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity duration-150"
          leave-from="opacity-100"
          leave-to="opacity-0"
          :class="`${calculateEditorWidth()} h-full flex flex-col ml-2`"
        >
          <StampEditor :model="getEditModel()" @cancel="hideEditor()" @save="save"></StampEditor>
        </TransitionRoot>
        <StampDeleteDialog
          :is-open="deleteModel.showDelete"
          :pref-paths="prefPaths"
          :stamps="deleteModel.deletingStamps"
          @close="processDelete"
        ></StampDeleteDialog>
        <StampPurchaseDialog
          :is-open="purchaseModel.show"
          :stamps="purchaseModel.stamps"
          @close="processPurchase"
        ></StampPurchaseDialog>
        <StampBulkEditDialog
          :is-open="bulkEditModel.show"
          :show-progress="bulkEditModel.progress"
          :stamps="bulkEditModel.stamps"
          @close="processBulkEdit"
        ></StampBulkEditDialog>
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
        <stamp-report-values
          class="ml-auto max-w-[240px] mr-5 md:flex hidden"
          @report-type-changed="changeReportType"
          :report-type="reporting.reportType"
          :value="reporting.reportValue"
        ></stamp-report-values>
        <display-stats
          class="mr-1"
          :start="startingCount"
          :end="endingCount"
          :total="getCollectionTotal()"
          :selected="getCurrentSelected().length"
        ></display-stats>
      </div>
    </div>
  </div>
</template>
<style></style>
