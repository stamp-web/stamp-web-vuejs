<script lang="ts">
import { reactive, ref, defineComponent, watch } from 'vue'
import _ from 'lodash'

import { Prompt } from '@/util/Prompt'
import { TransitionRoot } from '@headlessui/vue'
import StampCollectionEditor from '@/components/editors/StampCollectionEditor.vue'
import ClickableIconCellRenderer from '@/components/renderers/ClickableIconCellRenderer.vue'

import type { StampCollection } from '@/models/entityModels'
import { stampCollectionStore } from '@/stores/stampCollectionStore'
import { isNil } from '@/util/object-utils'
import { createInstance } from '@/models/entityModels'
import DataTableComponent from '@/components/tables/DataTableComponent.vue'
import { ColumnDefinition } from '@/components/tables/DataTableModels'

export default defineComponent({
  name: 'StampCollectionsView',
  components: {
    TransitionRoot,
    StampCollectionEditor,
    DataTableComponent,
    // eslint-disable-next-line vue/no-unused-components
    ClickableIconCellRenderer
  },

  setup() {
    const showEditor = ref(false)
    const editingModel = ref()
    const store = stampCollectionStore()
    const collections = reactive({
      list: [] as StampCollection[],
      selected: {} as StampCollection | undefined
    })

    return {
      editingModel,
      showEditor,
      store,
      collections,
      columnDefs: [
        new ColumnDefinition('name', 'Name'),
        ColumnDefinition.createActionIconColumn('sw-icon-edit', 'editrow'),
        new ColumnDefinition('description', 'Description')
      ]
    }
  },

  computed: {
    isSelected() {
      return !_.isEmpty(this.collections.selected)
    }
  },

  methods: {
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
    rowSelected(data: StampCollection) {
      this.collections.selected = data
    },

    iconSelected(eventName: string, data: StampCollection) {
      if (data) {
        switch (eventName) {
          case 'editrow':
            this.editingModel = _.cloneDeep(data)
            this.showEditor = true
        }
      }
    }
  },

  beforeMount() {},

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
      <DataTableComponent
        :columns="columnDefs as any"
        :data="collections.list as any"
        @icon-clicked="iconSelected"
        @selected="rowSelected"
      ></DataTableComponent>
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
