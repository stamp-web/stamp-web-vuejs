import { Locator, Page } from '@playwright/test'
import { SelectCmp } from './Select-cmp'
import { AbstractNamedEditorCmp } from './AbstractNamedEditor'

export class AlbumEditorCmp extends AbstractNamedEditorCmp {
  constructor(page: Page) {
    super(page)
  }
  getCollection(): SelectCmp {
    return new SelectCmp(this.page, 'stampCollectionRef')
  }
}
