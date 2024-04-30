import { Page } from '@playwright/test'
import { SelectCmp } from './Select-cmp.js'
import { AbstractNamedEditorCmp } from './AbstractNamedEditor.js'

export class CatalogueEditorCmp extends AbstractNamedEditorCmp {
  constructor(page: Page) {
    super(page)
  }

  getIssue() {
    return this.getLocator().locator('input[id="issue"]')
  }
  getCatalogueType(): SelectCmp {
    return new SelectCmp(this.page, 'type', false)
  }

  getCurrency(): SelectCmp {
    return new SelectCmp(this.page, 'code', false)
  }
}
