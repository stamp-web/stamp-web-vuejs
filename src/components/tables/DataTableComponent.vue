<script setup lang="ts">
import DataTable from 'datatables.net-vue3'
import DataTableCore from 'datatables.net'
import type { Config, Api } from 'datatables.net/types/types'
import 'datatables.net-scroller'
import 'datatables.net-responsive'
import 'datatables.net-fixedheader'
import 'datatables.net-select'
import _ from 'lodash'
import $ from 'jquery'

import { nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { ColumnDefinition } from '@/components/tables/DataTableModels'

DataTable.use(DataTableCore)

let dt
const table = ref()
const props = defineProps({
  data: Array,
  columns: Array<ColumnDefinition>,
  options: {}
})

const iconEvents: Array<ColumnDefinition> = []

const processIcons = (function () {
  const cols = props.columns
  if (cols) {
    cols.forEach((col: ColumnDefinition) => {
      if (col.icon && col.eventName) {
        iconEvents.push(col)
      }
    })
  }
})()

console.log(iconEvents)

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits(['selected', 'icon-clicked'])

// @ts-ignore
const defaultTableOptions = {
  info: false,
  autoWidth: false,
  responsive: true,
  fixedHeader: true,
  scrolling: false,
  searching: false,
  //scrollY: 'calc(100vh - 168px)',
  scrollX: false,
  //scrollCollapse: true,
  select: {
    items: 'row',
    style: 'single'
  },
  paging: false
} as Config

const tableOptions = _.merge(defaultTableOptions, props.options) as Config

onMounted(async () => {
  dt = table.value.dt
  let localDt = dt
  localDt.on(
    'select',
    (e: object, dt: Api<any>, type: string, indexes: Array<number>) => {
      const data = dt.row(indexes[0]).data()
      emit('selected', data)
    }
  )

  iconEvents.forEach((col: ColumnDefinition) => {
    if (col.icon && col.eventName) {
      // will memory leak if we don't store and remove
      localDt.on('click', `span.${col.icon}.__${col.eventName}__`, (e: any) => {
        let _data = localDt.row(e.target.closest('tr')).data()
        if (_data) {
          emit('icon-clicked', col.eventName, _data)
          // stop row selection from occuring
          e.stopPropagation()
        }
      })
    }
  })

  //await nextTick()

  $(window).resize(() => {
    /*    const wrapperNode = table.value.$parent.$el
    const parentNode = wrapperNode.parentNode

    _.debounce(() => {
      const scrollHead = $(wrapperNode).find('.dataTables_scrollHead');
      if(wrapperNode && parentNode && scrollHead ) {
        console.log('top', $(parentNode).scrollTop())
        const settings = localDt.settings();
        if( settings) {
          const oScroll = _.get(settings, '[0].oScroll');
          console.log(oScroll.sY, parentNode.offsetHeight, wrapperNode.offsetHeight);
          const px : number = parentNode.offsetHeight - scrollHead.height()
          $(wrapperNode).find('.dataTables_scrollBody').height(px)
          $(wrapperNode).find('.dataTables_scrollBody').css('max-height', `${px}px`)
          console.log(px)
          //oScroll.sY = `${px}px`
          //scrollHead.children('.dataTables_scollBody').css('height', px)

        }
      }
      //console.log('***', localDt.settings()[0].oScroll.sY)
      //localDt.responsive.rebuild();
    }, 250)();
//    console.log('window resized', localDt);*/
  })
})

/*
this.dt = this.table.dt;
    this.dt.on('select', (e : object, dt : any, type: sting, indexes: []) => {
      let data = this.dt.row(indexes[0]).data();
      console.log(data);
    });
 */
</script>

<template>
  <DataTable
    ref="table"
    :columns="columns"
    :data="data"
    :options="tableOptions"
    class="hover cell-border border-2"
  ></DataTable>
</template>
