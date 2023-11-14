<script lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { reactive, ref, defineComponent, watch } from 'vue'
import _isEmpty from 'lodash-es/isEmpty'
import _defer from 'lodash-es/defer'

import type { Country } from '@/models/entityModels'
import { countryStore } from '@/stores/countryStore'
import { createInstance } from '@/models/entityModels'
import { isNil } from '@/util/object-utils'

export default defineComponent({
  name: 'CountriesView',
  components: {
    AgGridVue
  },

  setup() {
    const gridApi = ref()
    const store = countryStore()
    const countries = reactive({
      list: [] as Country[],
      selected: {} as Country | undefined
    })

    watch(
      () => [countries.list],
      () => {
        _defer(() => {
          if (!isNil(gridApi.value)) {
            gridApi.value.setRowData(countries.list)
          }
        })
      },
      { deep: true }
    )

    return {
      store,
      countries,

      gridApi,
      gridOptions: null,
      columnDefs: Object.freeze([{ field: 'name' }, { field: 'description' }]),
      rowData: []
    }
  },

  computed: {
    isSelected() {
      return !_isEmpty(this.countries.selected)
    },
    selectedName() {
      return !_isEmpty(this.countries.selected) ? this.countries.selected.name : 'Nope'
    }
  },

  methods: {
    onGridReady(params: any) {
      this.gridApi = params.api
      this.gridApi.sizeColumnsToFit()
    },

    onSelected() {
      const selectedRows = this.gridApi.getSelectedRows()
      this.countries.selected = selectedRows.at(0)
    },

    create() {
      let c: Country = createInstance<Country>({
        name: 'aaa-test-' + new Date().getTime(),
        description: 'test of a description'
      })
      this.gridApi.showLoadingOverlay()
      this.store.create(c).then(() => {
        this.gridApi.hideOverlay()
      })
    },

    remove() {
      if (this.isSelected) {
        this.store.remove(this.countries.selected as Country).then(() => {
          this.countries.selected = undefined
        })
      }
    }
  },

  mounted() {
    this.store.find().then((result: Country[]) => {
      this.countries.list = result
    })
  }
})
</script>

<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-col">
    <span class="sw-icon-country"></span>
    <ag-grid-vue
      class="ag-theme-alpine grid flex-shrink flex-auto flex-grow min-h-[12rem]"
      :columnDefs="columnDefs"
      :rowData="rowData"
      rowSelection="single"
      @grid-ready="onGridReady"
      @selection-changed="onSelected"
    >
    </ag-grid-vue>
    <p>{{ selectedName }}</p>
    <button @click="create()">Create</button>
    <button @click="remove()" :disabled="!isSelected">Delete</button>
  </div>
</template>
