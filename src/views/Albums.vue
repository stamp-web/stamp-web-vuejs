<script lang="ts">
import { reactive, ref, defineComponent, watch } from 'vue'
import type { Album } from '../models/entityModels'
import { albumStore } from '../stores/albumStore'
import { createInstance } from '../models/entityModels'
import _ from 'lodash-es'
import { AgGridVue } from 'ag-grid-vue3'
import { isNil } from '@/util/object-utils'

export default defineComponent({
  name: 'AlbumsView',
  components: {
    AgGridVue
  },

  setup() {
    const gridApi = ref()
    const store = albumStore()
    const albums = reactive({ list: [] as Album[], selected: {} as Album | undefined })

    watch(
      () => [albums.list],
      () => {
        _.defer(() => {
          if (!isNil(gridApi.value)) {
            gridApi.value.showLoadingOverlay()
            gridApi.value.setRowData(albums.list)
            gridApi.value.hideOverlay()
          }
        })
      },
      { deep: true }
    )

    return {
      store,
      albums,

      gridApi,
      gridOptions: null,
      columnDefs: Object.freeze([{ field: 'name' }, { field: 'description' }]),
      rowData: []
    }
  },

  computed: {
    isSelected() {
      return !_.isEmpty(this.albums.selected)
    }
  },

  methods: {
    onGridReady(params: any) {
      this.gridApi = params.api
      this.gridApi.sizeColumnsToFit()
    },

    onSelected() {
      const selectedRows = this.gridApi.getSelectedRows()
      this.albums.selected = selectedRows.at(0)
    },

    remove() {
      if (this.isSelected) {
        this.store.remove(this.albums.selected as Album).then(() => {
          this.albums.selected = undefined
        })
      }
    },

    create() {
      let c: Album = createInstance<Album>({
        name: 'album-test-' + new Date().getTime(),
        description: 'test of a description',
        stampCollectionRef: 1
      })
      this.gridApi.showLoadingOverlay()
      this.store.create(c)
      this.gridApi.hideOverlay()
    }
  },

  async mounted() {
    this.albums.list = await this.store.find()
  }
})
</script>

<template>
  <div class="flex flex-col">
    <ag-grid-vue
      class="ag-theme-alpine grid flex-shrink flex-auto flex-grow min-h-[12rem]"
      :columnDefs="columnDefs"
      :rowData="rowData"
      rowSelection="single"
      @grid-ready="onGridReady"
      @selection-changed="onSelected"
    >
    </ag-grid-vue>
    <button @click="remove()">Remove</button>
    <button @click="create()">Create</button>
  </div>
</template>
