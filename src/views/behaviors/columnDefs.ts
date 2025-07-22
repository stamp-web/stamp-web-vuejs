import { useI18n } from 'vue-i18n'
import { ColumnDefinition } from '@/components/table/DataGridModels'
import ImagePreviewCellRenderer from '@/components/renderers/ImagePreviewCellRenderer.vue'
import CountryCellRenderer from '@/components/renderers/CountryCellRenderer.vue'
import CatalogueValueCellRenderer from '@/components/renderers/CatalogueValueCellRenderer.vue'
import PricePaidCellRenderer from '@/components/renderers/PricePaidCellRenderer.vue'
import BasicCellValueRenderer from '@/components/renderers/BasicCellValueRenderer.vue'
import NotesCellRenderer from '@/components/renderers/NotesCellRenderer.vue'
import CertCellRenderer from '@/components/renderers/CertCellRenderer.vue'
import ConditionCellRenderer from '@/components/renderers/ConditionCellRenderer.vue'
import GradeCellRenderer from '@/components/renderers/GradeCellRenderer.vue'
import type { PreferencePaths } from '@/views/types/preferencePaths'

export function createStampColumnDefs(
  prefPaths: PreferencePaths,
  transformationCallback: unknown
): ColumnDefinition[] {
  const { t } = useI18n()
  return [
    new ColumnDefinition('', {
      cellRenderer: ImagePreviewCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].img',
        prefs: prefPaths
      },
      cellClass: ['!p-0.75'],
      maxWidth: 40,
      sortable: false
    }),
    new ColumnDefinition('countryRef', {
      cellClass: ['!pr-0.25'],
      cellRenderer: CountryCellRenderer,
      headerName: t('table-columns.country'),
      sortable: false
    }),
    new ColumnDefinition('rate', {
      cellClass: ['!pr-0.25'],
      headerName: t('table-columns.rate'),
      maxWidth: 150,
      sortable: true
    }),
    new ColumnDefinition('description', {
      cellClass: ['!pr-0.25'],
      colId: 'description',
      headerName: t('table-columns.description'),
      sortable: true,
      cellRenderer: BasicCellValueRenderer
    }),
    new ColumnDefinition('activeCatalogueNumber.number', {
      cellClass: ['!pr-0.25'],
      colId: 'number',
      comparator: () => {
        return 0
      },
      headerName: t('table-columns.catalogue-number'),
      maxWidth: 150,
      sort: 'asc',
      sortable: true
    }),
    ColumnDefinition.createActionIconColumn(
      'sw-icon-edit',
      transformationCallback,
      t('actions.edit')
    ),
    new ColumnDefinition('activeCatalogueNumber.value', {
      cellClass: ['!pr-0.25'],
      cellRenderer: CatalogueValueCellRenderer,
      colId: 'value',
      headerName: t('table-columns.catalogue-value'),
      maxWidth: 150,
      sortable: true
    }),
    new ColumnDefinition(
      '',
      Object.assign(ColumnDefinition.getActionIconProperties(), {
        cellRenderer: NotesCellRenderer,
        cellRendererParams: {
          path: 'stampOwnerships[0]'
        },
        colId: 'notes',
        maxWidth: 24,
        minWidth: 24,
        sortable: false
      })
    ),
    new ColumnDefinition(
      '',
      Object.assign(ColumnDefinition.getActionIconProperties(), {
        cellRenderer: CertCellRenderer,
        cellRendererParams: {
          path: 'stampOwnerships[0]'
        },
        colId: 'cert',
        maxWidth: 24,
        minWidth: 24,
        sortable: false
      })
    ),
    new ColumnDefinition('', {
      cellClass: ['!pr-0.25'],
      cellRenderer: ConditionCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].condition'
      },
      colId: 'condition',
      headerName: t('table-columns.condition'),
      maxWidth: 170,
      sortable: true
    }),
    new ColumnDefinition('', {
      cellClass: ['!pr-0.25'],
      cellRenderer: GradeCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0].grade'
      },
      colId: 'grade',
      headerName: t('table-columns.grade'),
      maxWidth: 170,
      sortable: true
    }),
    new ColumnDefinition('', {
      cellClass: ['!pr-0.25'],
      colId: 'pricePaid',
      cellRenderer: PricePaidCellRenderer,
      cellRendererParams: {
        path: 'stampOwnerships[0]'
      },
      headerName: t('table-columns.price-paid'),
      maxWidth: 150
    })
  ]
}
