<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed, inject, nextTick, onMounted, ref, toRaw, watchEffect } from 'vue'
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
  import ReportGenerationDialog from '@/components/dialogs/ReportGenerationDialog.vue'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import PagingComponent from '@/components/table/PagingComponent.vue'
  import StampCard from '@/components/display/StampCard.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import DisplayStats from '@/components/display/DisplayStats.vue'
  import StampReportValues from '@/components/display/StampReportValues.vue'
  import pagingInfo from '@/components/behaviors/pageInfo'
  import PagingSizeInput from '@/components/inputs/PagingSizeInput.vue'
  import FilterInput from '@/components/inputs/FilterInput.vue'
  import ConditionFilterInput from '@/components/inputs/ConditionFilterInput.vue'

  import StampEditor from '@/components/editors/StampEditor.vue'

  import { Prompt } from '@/components/Prompt'

  import { type Stamp, StampModelHelper } from '@/models/Stamp'
  import { OwnershipHelper } from '@/models/Ownership'
  import { ReportType } from '@/models/ReportType'
  import { StampModelUtils } from '@/models/StampModelUtils'
  import type { ReportResult } from '@/models/ReportResult'
  import { CurrencyTools } from '@/models/CurrencyCode'

  import reportService from '@/services/ReportService'

  import { preferenceStore } from '@/stores/PreferenceStore'
  import { catalogueStore } from '@/stores/catalogueStore'
  import { countryStore } from '@/stores/countryStore'
  import { stampStore } from '@/stores/stampStore'
  import LocalCache from '@/stores/LocalCache'

  import { extractErrorMessage } from '@/util/object-utils'
  import { PredicateUtilities } from '@/util/predicate-util'
  import { PdfGenerator } from '@/util/reports/pdf-generator'
  import { OdataUtil } from '@/util/odata-util'
  import WantListFilterInput from '@/components/inputs/WantListFilterInput.vue'
  import SearchForm from '@/components/forms/SearchForm.vue'
  import type { PreferencePaths } from '@/views/types/preferencePaths'
  import { createStampColumnDefs } from '@/views/behaviors/columnDefs'
  import type { ReportData } from '@/views/types/reportDefs'
  import type { ODataParams } from '@/services/types/odataParams'
  import type { ColumnDefinition } from '@/components/table/DataGridModels'
  import type { ColumnControl } from '@/views/types/columnControl'

  const { t } = useI18n()

  const logger = inject('vuejs3-logger') as Log

  const route = useRoute()
  const router = useRouter()

  const dataGridRef = ref()
  const columnControl = ref<ColumnControl>({
    cert: true,
    grade: true,
    notes: true,
    pricePaid: true
  })
  const store = stampStore()
  const countriesStore = countryStore()
  const cataloguesStore = catalogueStore()
  const prefStore = preferenceStore()
  const query = ref<ODataParams>({ $skip: 1000, $top: 0, $filter: '', $orderby: '' })

  const state = ref({
    predicates: [] as Predicate[],
    filterPredicates: [] as Predicate[],
    condition: 'All',
    filterText: '',
    wantList: 'All'
  })

  const purchaseModel = ref({
    show: false,
    stamps: [] as Stamp[]
  })

  const reportPrintModel = ref({
    show: false
  })

  const deleteModel = ref({
    showDelete: false,
    deletingStamps: [] as Stamp[]
  })

  const bulkEditModel = ref({
    show: false,
    progress: false,
    stamps: [] as Stamp[]
  })

  const stampView = ref()
  const cardLayout = ref()
  const buttonToolbar = ref()
  const footer = ref()
  const reporting = ref<ReportData>({
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

  const prefPaths = ref<PreferencePaths>({
    imagePath: '/',
    thumbPath: '/'
  })

  const stampModelUtils = new StampModelUtils()

  const transformEditModel = (m: Stamp) => {
    if (m.stampOwnerships?.length > 0) {
      OwnershipHelper.toTagElementView(m.stampOwnerships[0])
    }
    setEditModel(m)
  }

  const columnDefs = ref<ColumnDefinition[]>(
    createStampColumnDefs(prefPaths.value, transformEditModel)
  )

  watchEffect(() => {
    Object.keys(columnControl.value).forEach((key) => {
      columnControl.value[key as keyof ColumnControl] = !isEditorShown()
    })
  })

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

  const processPrintReport = async (generate: boolean, options: any) => {
    reportPrintModel.value.show = false
    if (generate) {
      const opts = reportService.buildReport(
        getCollection(),
        await countriesStore.find(),
        await cataloguesStore.find(),
        reporting.value.reportValue,
        {
          model: options
        }
      )
      new PdfGenerator().printReport(opts)
    }
  }

  const print = async () => {
    reportPrintModel.value.show = true
  }

  function getCurrentSelectedStamps() {
    return getCurrentSelected().slice()
  }

  const purchase = () => {
    purchaseModel.value.stamps = getCurrentSelectedStamps()
    purchaseModel.value.show = true
  }

  const bulkEdit = () => {
    bulkEditModel.value.stamps = getCurrentSelectedStamps()
    bulkEditModel.value.show = true
  }

  const deleteSelected = () => {
    deleteModel.value.deletingStamps = getCurrentSelectedStamps()
    deleteModel.value.showDelete = true
  }

  const processDelete = async (stamps: Array<Stamp>) => {
    if (stamps && stamps.length > 0) {
      const toUpdate: Stamp[] = []
      const promises: Promise<any>[] = []
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
      const selectedStamps = getCurrentSelectedStamps()
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

  const convert = async () => {
    const sm = getEditModel()
    // add new stamp ownership to model
    sm.stampOwnerships.push(OwnershipHelper.newInstance(await prefStore.findByCategory('stamps')))
    sm.wantList = false
    transformEditModel(sm)
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

  onMounted(async () => {
    dataGridRef.value.loadingStarted()
    const thumbPref = await prefStore.findByNameAndCategory('thumbPath', 'stamps')
    const imagePref = await prefStore.findByNameAndCategory('imagePath', 'stamps')
    prefPaths.value.thumbPath = thumbPref.value ?? '/'
    prefPaths.value.imagePath = imagePref.value ?? '/'
    await setupInitialQuery()
    await gotoPage(1)
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
          <StampEditor
            :model="getEditModel()"
            @cancel="hideEditor()"
            @save="save"
            @convert="convert()"
          ></StampEditor>
        </TransitionRoot>
        <StampDeleteDialog
          :is-open="deleteModel.showDelete"
          :pref-paths="prefPaths"
          :stamps="deleteModel.deletingStamps"
          @close="processDelete"
        ></StampDeleteDialog>
        <ReportGenerationDialog
          :is-open="reportPrintModel.show"
          @close="processPrintReport"
        ></ReportGenerationDialog>
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
