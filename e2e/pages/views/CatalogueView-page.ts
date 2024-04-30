import { Page } from '@playwright/test'
import { AbstractNamedViewPage } from './AbstractNamedView-page.js'
import { CatalogueEditorCmp } from '../components/CatalogueEditor-cmp.js'

export class CatalogueViewPage extends AbstractNamedViewPage<CatalogueEditorCmp> {
  constructor(page: Page) {
    super(page)
  }

  getModelName(): string {
    return 'catalogue'
  }

  newEditorInstance(): CatalogueEditorCmp {
    return new CatalogueEditorCmp(this.page)
  }
  getCreateAction(): string {
    return 'New Catalogue'
  }
  getPageURL(): string {
    return '/#/catalogues'
  }
}
