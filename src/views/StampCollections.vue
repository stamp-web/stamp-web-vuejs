<script lang="ts">
import { reactive, ref, defineComponent, watch } from 'vue'
import _ from 'lodash'

import { AgGridVue } from 'ag-grid-vue3'
import { Prompt } from '@/util/Prompt'
import { TransitionRoot } from '@headlessui/vue'
import StampCollectionEditor from '@/components/editors/StampCollectionEditor.vue'
import ClickableIconCellRenderer from '@/components/renderers/ClickableIconCellRenderer.vue'

import type { StampCollection } from '@/models/entityModels'
import { stampCollectionStore } from '@/stores/stampCollectionStore'
import { isNil } from '@/util/object-utils'
import { createInstance } from '@/models/entityModels'

export default defineComponent({
  name: 'StampCollectionsView',
  components: {
    AgGridVue,
    TransitionRoot,
    StampCollectionEditor,
    // eslint-disable-next-line vue/no-unused-components
    ClickableIconCellRenderer
  },

  setup() {
    const showEditor = ref(false)
    const editingModel = ref()
    const gridApi = ref()
    const context = ref()
    const store = stampCollectionStore()
    const collections = reactive({
      list: [] as StampCollection[],
      selected: {} as StampCollection | undefined
    })

    watch(
      () => [collections.list],
      () => {
        _.defer(() => {
          if (!isNil(gridApi.value)) {
            gridApi.value.showLoadingOverlay()
            gridApi.value.setRowData(collections.list)
            gridApi.value.hideOverlay()
          }
        })
      },
      { deep: true }
    )

    watch(
      () => [showEditor],
      () => {
        if (!isNil(gridApi.value)) {
          gridApi.value.sizeColumnsToFit()
        }
      }
    )

    return {
      editingModel,
      showEditor,
      store,
      collections,
      context,
      gridApi,
      gridOptions: null,

      columnDefs: Object.freeze([
        { field: 'name', resizable: true },
        {
          width: 2,
          cellClass: ['!p-0.25', 'max-w-[2rem]', '!flex', 'items-center'],
          cellRenderer: 'ClickableIconCellRenderer',
          cellRendererParams: {
            icon: 'sw-icon-edit',
            onClick: 'editRow'
          }
        },
        { field: 'description', resizable: true }
      ]),
      rowData: []
    }
  },

  computed: {
    isSelected() {
      return !_.isEmpty(this.collections.selected)
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
      if (this.isSelected && selectedCollection) {
        Prompt.confirm({
          message: `Delete the collection '${selectedCollection.name}'?`
        }).then((confirmed) => {
          if (confirmed) {
            this.store.remove(this.collections.selected as StampCollection).then(() => {
              this.collections.selected = undefined
            })
          }
        })
      }
    },
    create() {
      this.editingModel = createInstance<StampCollection>({})
      this.showEditor = true
    },
    close() {
      this.showEditor = false
    },
    save() {
      if (this.editingModel.id && this.editingModel.id > 0) {
        this.store.update(this.editingModel).then(() => {
          this.showEditor = false
        })
      } else {
        this.store.create(this.editingModel).then(() => {
          this.showEditor = false
        })
      }
    },
    editRow(index: number) {
      if (index >= 0) {
        const sc: StampCollection = this.gridApi.getRowNode(index).data
        if (sc) {
          this.editingModel = _.cloneDeep(sc)
          this.showEditor = true
        }
      }
    }
  },

  beforeMount() {
    this.context = { component: this }
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
        <button
          @click="create()"
          class="sw-icon-plus hover:bg-blue-500 hover:text-gray-50 text-gray-800 rounded p-1 border-2"
        >
          New Stamp Collection
        </button>
        <button
          @click="remove()"
          :disabled="!isSelected"
          class="sw-icon-delete enabled:text-gray-800 text-gray-300 rounded p-1 border-2"
        >
          Delete
        </button>
      </div>
      <ag-grid-vue
        class="ag-theme-alpine grid flex-shrink flex-auto flex-grow min-h-[12rem]"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :context="context"
        rowSelection="single"
        @grid-ready="onGridReady"
        @selection-changed="onSelected"
      >
      </ag-grid-vue>
    </div>
    <TransitionRoot
      :show="showEditor"
      enter="transition-opacity duration-75"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity duration-1500"
      leave-from="opacity-100"
      leave-to="opacity-0"
      class="max-w-[20rem] min-w-[20rem] h-full flex flex-col border-2 ml-1"
    >
      <StampCollectionEditor
        :model="editingModel"
        @cancel="showEditor = false"
        @save="save()"
        class=""
      ></StampCollectionEditor>
    </TransitionRoot>
  </div>
</template>
