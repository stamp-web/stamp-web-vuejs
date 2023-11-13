<script lang="ts">
import { reactive, ref, defineComponent, watch } from 'vue'
import _ from 'lodash'

import { Prompt } from '@/components/Prompt'
import { TransitionRoot } from '@headlessui/vue'
import StampCollectionEditor from '@/components/editors/StampCollectionEditor.vue'
import DataGridComponent from '@/components/table/DataGridComponent.vue'
import type { StampCollection } from '@/models/entityModels'
import { stampCollectionStore } from '@/stores/stampCollectionStore'
import { createInstance } from '@/models/entityModels'
import { ColumnDefinition } from '@/components/table/DataGridModels'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

// look into https://vuejs.org/guide/components/async.html
export default defineComponent({
  name: 'StampCollectionsView',
  components: {
    PrimaryButton,
    SecondaryButton,
    TransitionRoot,
    StampCollectionEditor,
    DataGridComponent
  },

  setup() {
    const dataGridRef = ref()
    const showEditor = ref(false)
    const editingModel = ref()
    const context = ref()
    const store = stampCollectionStore()
    const collections = reactive({
      list: new Array<StampCollection>(),
      selected: {} as StampCollection | undefined
    })

    watch(
      () => [showEditor.value],
      () => {
        dataGridRef.value.resizeColumns()
      }
    )

    return {
      editingModel,
      showEditor,
      store,
      collections,
      context,
      dataGridRef,

      columnDefs: [
        new ColumnDefinition('name'),
        ColumnDefinition.createActionIconColumn('sw-icon-edit', 'editRow'),
        new ColumnDefinition('description')
      ],
      rowData: []
    }
  },

  computed: {
    isSelected() {
      return !_.isEmpty(this.collections.selected)
    }
  },

  methods: {
    onSelected(selected: StampCollection) {
      this.collections.selected = selected
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
      this.showEditor = true
      this.editingModel = createInstance<StampCollection>({})
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    editRow(model: StampCollection, index: number) {
      if (model) {
        this.editingModel = _.cloneDeep(model)
        this.showEditor = true
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
        <PrimaryButton class="mr-1" @click="create()" icon="sw-icon-plus">
          New Stamp Collection
        </PrimaryButton>
        <SecondaryButton @click="remove()" :disabled="!isSelected" icon="sw-icon-delete">
          Delete
        </SecondaryButton>
      </div>
      <DataGridComponent
        ref="dataGridRef"
        :columnDefs="columnDefs"
        :rowData="collections.list"
        :context="context"
        @selected="onSelected"
      >
      </DataGridComponent>
    </div>
    <TransitionRoot
      :show="showEditor"
      enter="transition-opacity duration-75"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity duration-150"
      leave-from="opacity-100"
      leave-to="opacity-0"
      class="max-w-[20rem] min-w-[20rem] h-full flex flex-col ml-2"
    >
      <StampCollectionEditor
        :model="editingModel"
        @cancel="showEditor = false"
        @save="save()"
      ></StampCollectionEditor>
    </TransitionRoot>
  </div>
</template>
