<script setup lang="ts">
  import { ref, onBeforeMount, onMounted } from 'vue'

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
  import { Operators, Predicate } from 'odata-filter-parser'
  import { useRouter } from 'vue-router'

  import filterableCollection from '@/components/behaviors/filterableCollection'
  import editableModel from '@/components/behaviors/editableModel'

  const router = useRouter()

  const {
    setCollection,
    filterCollection,
    setFilterString,
    getFilteredList,
    getFilterString,
    getSelected,
    setSelected
  } = filterableCollection('stampCollections-filter')

  const { isEditorShown, setEditModel, getEditModel, hideEditor } = editableModel()

  const dataGridRef = ref()
  const context = ref()
  const store = stampCollectionStore()
  const columnDefs = [
    new ColumnDefinition('name', { sort: 'asc' }),
    ColumnDefinition.createActionIconColumn('sw-icon-edit', 'setEditModel'),
    ColumnDefinition.createActionIconColumn(
      'sw-icon-search',
      'findStamps',
      'Find Stamps'
    ),
    new ColumnDefinition('description')
  ]

  const filterList = () => {
    dataGridRef.value.loadingStarted()
    filterCollection()
    dataGridRef.value.loadingComplete()
  }

  const filterChanged = (filterText: string) => {
    setFilterString(filterText)
    filterList()
  }

  const create = () => {
    setEditModel(createInstance<StampCollection>({}))
  }

  const remove = () => {
    const selectedCollection = getSelected() as StampCollection
    if (selectedCollection) {
      Prompt.confirm({
        message: `Delete the collection '${selectedCollection.name}'?`
      }).then(async (confirmed) => {
        if (confirmed) {
          await store.remove(selectedCollection)
          // @ts-ignore
          setSelected(undefined)
          filterList()
        }
      })
    }
  }

  const save = async () => {
    const editModel = getEditModel() as StampCollection
    if (editModel && editModel.id > 0) {
      await store.update(editModel)
    } else {
      await store.create(editModel)
    }
    hideEditor()
    filterList()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const findStamps = (model: StampCollection) => {
    let p = new Predicate({
      subject: 'stampCollectionRef',
      operator: Operators.EQUALS,
      value: model.id
    })
    router.push({ path: '/stamps', query: { $filter: `${p.serialize()}` } })
  }

  onBeforeMount(() => {
    context.value = { callbackFn: [setEditModel, findStamps] }
  })

  onMounted(async () => {
    dataGridRef.value.loadingStarted()
    setCollection(await store.find())
    filterList()
  })
</script>

<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row">
    <div class="flex-grow flex-auto flex flex-col">
      <div class="flex mb-1">
        <FilterInput
          class="mr-4 filter-input"
          placeholder="Filter"
          :filter-text="getFilterString()"
          @filter-changed="filterChanged"
        ></FilterInput>
        <PrimaryButton class="mr-1" @click="create()" icon="sw-icon-plus">
          New Stamp Collection
        </PrimaryButton>
        <SecondaryButton
          @click="remove()"
          :disabled="!getSelected()"
          icon="sw-icon-delete"
        >
          Delete
        </SecondaryButton>
      </div>
      <DataGridComponent
        class=""
        ref="dataGridRef"
        :columnDefs="columnDefs"
        :rowData="getFilteredList()"
        :context="context"
        @selected="setSelected"
      >
      </DataGridComponent>
    </div>
    <TransitionRoot
      :show="isEditorShown()"
      enter="transition-opacity duration-75"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity duration-150"
      leave-from="opacity-100"
      leave-to="opacity-0"
      class="max-w-[20rem] min-w-[20rem] h-full flex flex-col ml-2"
    >
      <StampCollectionEditor
        :model="getEditModel()"
        @cancel="hideEditor()"
        @save="save()"
      ></StampCollectionEditor>
    </TransitionRoot>
  </div>
</template>
