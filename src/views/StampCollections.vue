<script lang="ts">
  import { ref, defineComponent } from 'vue'
  import isEmpty from 'lodash-es/isEmpty'
  import cloneDeep from 'lodash-es/cloneDeep'

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
  import FilterInput from '@/components/inputs/FilterInput.vue'

  // look into https://vuejs.org/guide/components/async.html
  export default defineComponent({
    name: 'StampCollectionsView',
    components: {
      FilterInput,
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
      const collections = ref({
        list: new Array<StampCollection>(),
        filteredList: new Array<StampCollection>(),
        selected: {} as StampCollection | undefined,
        filterString: ''
      })

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
        return !isEmpty(this.collections.selected)
      }
    },

    methods: {
      onSelected(selected: StampCollection) {
        this.collections.selected = selected
      },

      filterList() {
        this.collections.filteredList = this.collections.list.filter(
          (item: StampCollection) => {
            return (
              item.name.includes(this.collections.filterString) ||
              (item.description &&
                item.description.includes(this.collections.filterString))
            )
          }
        )
      },

      filterChanged(filterText: string) {
        this.collections.filterString = filterText
        this.filterList()
      },

      remove() {
        const selectedCollection = this.collections.selected
        if (this.isSelected && selectedCollection) {
          Prompt.confirm({
            message: `Delete the collection '${selectedCollection.name}'?`
          }).then(async (confirmed) => {
            if (confirmed) {
              await this.store.remove(this.collections.selected as StampCollection)
              this.collections.selected = undefined
              this.filterList()
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
      async save() {
        if (this.editingModel.id && this.editingModel.id > 0) {
          await this.store.update(this.editingModel)
          this.showEditor = false
        } else {
          await this.store.create(this.editingModel)
          this.showEditor = false
        }
        this.filterList()
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      editRow(model: StampCollection, index: number) {
        if (model) {
          this.editingModel = cloneDeep(model)
          this.showEditor = true
        }
      }
    },

    beforeMount() {
      this.context = { component: this }
    },

    async mounted() {
      this.collections.list = await this.store.find()
      this.filterList()
    }
  })
</script>

<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row">
    <div class="flex-grow flex-auto flex flex-col">
      <div class="flex mb-1">
        <FilterInput
          class="mr-4"
          placeholder="Filter"
          @filter-changed="filterChanged"
        ></FilterInput>
        <PrimaryButton class="mr-1" @click="create()" icon="sw-icon-plus">
          New Stamp Collection
        </PrimaryButton>
        <SecondaryButton @click="remove()" :disabled="!isSelected" icon="sw-icon-delete">
          Delete
        </SecondaryButton>
      </div>
      <DataGridComponent
        class="w-[calc(100% - 1px)]"
        ref="dataGridRef"
        :columnDefs="columnDefs"
        :rowData="collections.filteredList"
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
