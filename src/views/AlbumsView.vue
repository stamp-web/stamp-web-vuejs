<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { Operators, Predicate } from 'odata-filter-parser'

  import type { Album } from '@/models/entityModels'
  import { albumStore } from '@/stores/albumStore'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import AlbumEditor from '@/components/editors/AlbumEditor.vue'
  import { Prompt } from '@/components/Prompt'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import FilterInput from '@/components/inputs/FilterInput.vue'
  import { createInstance } from '@/models/entityModels'
  import { TransitionRoot } from '@headlessui/vue'
  import StampCollectionCellRenderer from '@/components/renderers/StampCollectionCellRenderer.vue'

  import filterableCollection from '@/components/behaviors/filterableCollection'
  import editableModel from '@/components/behaviors/editableModel'
  import { useRouter } from 'vue-router'
  import stampCount from '@/components/renderers/formatters/StampCountValueFormatter'

  const router = useRouter()

  const {
    setCollection,
    filterCollection,
    setFilterString,
    getFilteredList,
    getFilterString,
    getSelected,
    setSelected
  } = filterableCollection('albums-filter')
  const { isEditorShown, setEditModel, getEditModel, hideEditor } = editableModel()
  const dataGridRef = ref()
  const store = albumStore()

  const findStamps = (model: Album) => {
    let p = new Predicate({
      subject: 'albumRef',
      operator: Operators.EQUALS,
      value: model.id
    })
    router.push({ path: '/stamps', query: { $filter: `${p.serialize()}` } })
  }

  const columnDefs = [
    new ColumnDefinition('name', { sort: 'asc' }),
    ColumnDefinition.createActionIconColumn('sw-icon-edit', setEditModel),
    ColumnDefinition.createActionIconColumn('sw-icon-search', findStamps, 'Find Stamps'),
    new ColumnDefinition('count', { maxWidth: 100, valueFormatter: stampCount }),
    new ColumnDefinition('description'),
    new ColumnDefinition('stampCollectionRef', {
      cellRenderer: StampCollectionCellRenderer,
      headerName: 'Stamp Collection'
    })
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
    setEditModel(createInstance<Album>({}))
  }

  const remove = () => {
    const selectedAlbum = getSelected() as Album
    if (selectedAlbum) {
      Prompt.confirm({
        message: `Delete the album '${selectedAlbum.name}'?`
      }).then(async (confirmed) => {
        if (confirmed) {
          await store.remove(selectedAlbum)
          // @ts-ignore
          setSelected(undefined)
          filterList()
        }
      })
    }
  }

  const save = async () => {
    const editModel = getEditModel() as Album
    if (editModel && editModel.id > 0) {
      await store.update(editModel)
    } else {
      await store.create(editModel)
    }
    hideEditor()
    filterList()
  }

  onMounted(async () => {
    dataGridRef.value.loadingStarted()
    setCollection(await store.find())
    await store.getStampCount()
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
          New Album
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
      <AlbumEditor
        :model="getEditModel()"
        @cancel="hideEditor()"
        @save="save()"
      ></AlbumEditor>
    </TransitionRoot>
  </div>
</template>
