<script lang="ts" setup>
  import { ref, onBeforeMount, onMounted } from 'vue'
  import { Operators, Predicate } from 'odata-filter-parser'

  import type { Album } from '@/models/entityModels'
  import { albumStore } from '@/stores/albumStore'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import AlbumEditor from '@/components/editors/AlbumEditor.vue'
  import { Prompt } from '@/components/Prompt'
  import LocalCache from '@/stores/LocalCache'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import FilterInput from '@/components/inputs/FilterInput.vue'
  import _debounce from 'lodash-es/debounce'
  import { createInstance } from '@/models/entityModels'
  import { TransitionRoot } from '@headlessui/vue'
  import StampCollectionCellRenderer from '@/components/renderers/StampCollectionCellRenderer.vue'

  import filterableCollection from '@/components/behaviors/filterableCollection'
  import editableModel from '@/components/behaviors/editableModel'
  import { useRouter } from 'vue-router'

  const FILTER_KEY = 'albums-filter'

  const UpdateLocalCache = _debounce((value: string) => {
    LocalCache.setItem(FILTER_KEY, value)
  }, 500)

  const router = useRouter()

  const {
    setCollection,
    filterCollection,
    setFilterString,
    getFilteredList,
    getFilterString,
    getSelected,
    setSelected
  } = filterableCollection()
  const { isEditorShown, setEditModel, getEditModel, hideEditor } = editableModel()
  const dataGridRef = ref<typeof DataGridComponent>()
  const context = ref()
  const store = albumStore()

  const columnDefs = [
    new ColumnDefinition('name', { sort: 'asc' }),
    ColumnDefinition.createActionIconColumn('sw-icon-edit', 'setEditModel'),
    ColumnDefinition.createActionIconColumn(
      'sw-icon-search',
      'findStamps',
      'Find Stamps'
    ),
    new ColumnDefinition('description'),
    new ColumnDefinition('stampCollectionRef', {
      cellRenderer: StampCollectionCellRenderer,
      headerName: 'Stamp Collection'
    })
  ]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const findStamps = (model: Album) => {
    let p = new Predicate({
      subject: 'albumRef',
      operator: Operators.EQUALS,
      value: model.id
    })
    router.push({ path: '/stamps', query: { $filter: `${p.serialize()}` } })
  }

  const filterList = () => {
    // @ts-ignore
    dataGridRef.value.loadingStarted()
    filterCollection()
    // @ts-ignore
    dataGridRef.value.loadingComplete()
  }
  const filterChanged = (filterText: string) => {
    setFilterString(filterText)
    UpdateLocalCache(filterText)
    filterList()
  }

  const create = () => {
    setEditModel(createInstance<Album>({}))
  }

  const remove = () => {
    const selectedAlbum = getSelected()
    if (selectedAlbum) {
      Prompt.confirm({
        message: `Delete the album '${selectedAlbum.name}'?`
      }).then(async (confirmed) => {
        if (confirmed) {
          await store.remove(getSelected() as Album)
          // @ts-ignore
          setSelected(undefined)
          filterList()
        }
      })
    }
  }

  const save = async () => {
    const editModel = getEditModel()
    if (editModel && editModel.id > 0) {
      await store.update(editModel as Album)
      hideEditor()
    } else {
      await store.create(editModel as Album)
      hideEditor()
    }
    filterList()
  }

  onBeforeMount(() => {
    setFilterString(LocalCache.getItem(FILTER_KEY))
    context.value = { callbackFn: [setEditModel, findStamps] }
  })

  onMounted(async () => {
    // @ts-ignore
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
      <AlbumEditor
        :model="getEditModel()"
        @cancel="hideEditor()"
        @save="save()"
      ></AlbumEditor>
    </TransitionRoot>
  </div>
</template>
