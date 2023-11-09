<script lang="ts">
import { reactive, ref, defineComponent, watch } from 'vue'
import _defer from 'lodash/defer'
import _isEmpty from 'lodash/isEmpty'
import { AgGridVue } from 'ag-grid-vue3'
import {Prompt} from "@/util/Prompt";

import type { StampCollection } from '@/models/entityModels'
import { stampCollectionStore } from '@/stores/stampCollectionStore'
import { isNil } from '@/util/object-utils'

export default defineComponent({
  name: 'StampCollectionsView',
  components: {
    AgGridVue
  },

  setup() {
    const gridApi = ref()
    const store = stampCollectionStore()
    const collections = reactive({ list: [] as StampCollection[], selected: {} as StampCollection | undefined })

    watch(
        () => [collections.list],
        () => {
          _defer(() => {
            if (!isNil(gridApi.value)) {
              gridApi.value.showLoadingOverlay()
              gridApi.value.setRowData(collections.list)
              gridApi.value.hideOverlay()
            }
          })
        },
        { deep: true }
    )

    return {
      store,
      collections,

      gridApi,
      gridOptions: null,
      columnDefs: Object.freeze([{ field: 'name' }, { field: 'description' }]),
      rowData: [],
    }
  },

  computed: {
    isSelected() {
      return !_isEmpty(this.collections.selected)
    }
  },

  methods: {
    onGridReady(params: any) {
      this.gridApi = params.api
      this.gridApi.sizeColumnsToFit()
    },

    onSelected() {
      const selectedRows = this.gridApi.getSelectedRows()
      this.collections.selected = selectedRows.at(0)
    },

    remove() {
      const selectedCollection = this.collections.selected
      if (this.isSelected && selectedCollection && selectedCollection.name) {
        Prompt.confirm({
          message: `Delete the collection '${selectedCollection.name}'?`
        }).then(confirmed => {
          if(confirmed) {
            this.store.remove(this.collections.selected as StampCollection).then(() => {
              this.collections.selected = undefined
            })
          }
        });
      }
    },


  },

  async mounted() {
    this.collections.list = await this.store.find()
  }
})
</script>

<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row">
    <div class="flex-grow flex-auto flex flex-col">
      <div class="flex mb-1">
        <button @click="create()" class="sw-icon-plus hover:bg-blue-500 hover:text-gray-50 text-gray-800 rounded p-1 border-2">New Stamp Collection</button>
        <button @click="remove()" :disabled="!isSelected" class="sw-icon-delete enabled:text-gray-800 text-gray-300 rounded p-1 border-2">Delete</button>
      </div>
      <ag-grid-vue
          class="ag-theme-alpine grid flex-shrink flex-auto flex-grow min-h-[12rem]"
          :columnDefs="columnDefs"
          :rowData="rowData"
          rowSelection="single"
          @grid-ready="onGridReady"
          @selection-changed="onSelected"
      >
      </ag-grid-vue>
    </div>
  </div>
</template>
