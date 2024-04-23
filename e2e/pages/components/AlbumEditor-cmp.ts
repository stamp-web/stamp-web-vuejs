import { Page } from '@playwright/test'
import { SelectCmp } from './Select-cmp.js'
import { AbstractNamedEditorCmp } from './AbstractNamedEditor.js'

export class AlbumEditorCmp extends AbstractNamedEditorCmp {
  constructor(page: Page) {
    super(page)
  }
  getCollection(): SelectCmp {
    return new SelectCmp(this.page, 'stampCollectionRef')
  }
}
