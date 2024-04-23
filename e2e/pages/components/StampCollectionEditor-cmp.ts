import { Page } from '@playwright/test'
import { AbstractNamedEditorCmp } from './AbstractNamedEditor.js'

export class StampCollectionEditorCmp extends AbstractNamedEditorCmp {
  constructor(page: Page) {
    super(page)
  }
}
