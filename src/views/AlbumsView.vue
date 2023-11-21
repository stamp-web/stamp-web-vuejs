<script lang="ts">
  import { reactive, ref, defineComponent } from 'vue'
  import _isEmpty from 'lodash-es/isEmpty'

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
  import cloneDeep from 'lodash-es/cloneDeep'
  import { TransitionRoot } from '@headlessui/vue'
  import StampCollectionCellRenderer from '@/components/renderers/StampCollectionCellRenderer.vue'

  const FILTER_KEY = 'albums-filter'

  const UpdateLocalCache = _debounce((value: string) => {
    LocalCache.setItem(FILTER_KEY, value)
  }, 500)

  export default defineComponent({
    name: 'AlbumsView',
    components: {
      FilterInput,
      AlbumEditor,
      SecondaryButton,
      PrimaryButton,
      TransitionRoot,
      DataGridComponent
    },

    setup() {
      const dataGridRef = ref()
      const context = ref()
      const showEditor = ref(false)
      const editingModel = ref()
      const store = albumStore()
      const albums = reactive({
        list: new Array<Album>(),
        filteredList: new Array<Album>(),
        selected: {} as Album | undefined,
        filterString: ''
      })

      return {
        store,
        albums,
        showEditor,
        editingModel,
        dataGridRef,
        context,

        columnDefs: [
          new ColumnDefinition('name', { sort: 'asc' }),
          ColumnDefinition.createActionIconColumn('sw-icon-edit', 'editRow'),
          new ColumnDefinition('description'),
          new ColumnDefinition('stampCollectionRef', {
            cellRenderer: StampCollectionCellRenderer,
            headerName: 'Stamp Collection'
          })
        ]
      }
    },

    computed: {
      isSelected() {
        return !_isEmpty(this.albums.selected)
      }
    },

    methods: {
      onSelected(selected: Album) {
        this.albums.selected = selected
      },

      editRow(model: Album) {
        if (model) {
          this.editingModel = cloneDeep(model)
          this.showEditor = true
        }
      },

      filterList() {
        this.dataGridRef.loadingStarted()
        const searchString = this.albums.filterString.toUpperCase()
        this.albums.filteredList = this.albums.list.filter((item: Album) => {
          return (
            item.name.toUpperCase().includes(searchString) ||
            (item.description && item.description.toUpperCase().includes(searchString))
          )
        })
        this.dataGridRef.loadingComplete()
      },

      filterChanged(filterText: string) {
        this.albums.filterString = filterText
        UpdateLocalCache(filterText)
        this.filterList()
      },

      close() {
        this.showEditor = false
      },

      create() {
        this.editingModel = createInstance<Album>({})
        this.showEditor = true
      },

      remove() {
        const selectedAlbum = this.albums.selected
        if (this.isSelected && selectedAlbum) {
          Prompt.confirm({
            message: `Delete the album '${selectedAlbum.name}'?`
          }).then(async (confirmed) => {
            if (confirmed) {
              await this.store.remove(this.albums.selected as Album)
              this.albums.selected = undefined
              this.filterList()
            }
          })
        }
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
      }
    },

    beforeMount() {
      this.context = { component: this }
      this.albums.filterString = LocalCache.getItem(FILTER_KEY)
    },

    async mounted() {
      this.dataGridRef.loadingStarted()
      this.albums.list = await this.store.find()
      this.filterList()
    }
  })
</script>

<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row">
    <div class="flex-grow flex-auto flex flex-col">
      <div class="flex mb-1">
        <FilterInput
          class="mr-4 filter-input"
          placeholder="Filter"
          :filter-text="albums.filterString"
          @filter-changed="filterChanged"
        ></FilterInput>
        <PrimaryButton class="mr-1" @click="create()" icon="sw-icon-plus">
          New Album
        </PrimaryButton>
        <SecondaryButton @click="remove()" :disabled="!isSelected" icon="sw-icon-delete">
          Delete
        </SecondaryButton>
      </div>
      <DataGridComponent
        class=""
        ref="dataGridRef"
        :columnDefs="columnDefs"
        :rowData="albums.filteredList"
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
      <AlbumEditor :model="editingModel" @cancel="close()" @save="save()"></AlbumEditor>
    </TransitionRoot>
  </div>
</template>
