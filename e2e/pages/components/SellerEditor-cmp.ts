import { Page } from '@playwright/test'
import { AbstractNamedEditorCmp } from './AbstractNamedEditor.js'

export class SellerEditorCmp extends AbstractNamedEditorCmp {
  constructor(page: Page) {
    super(page)
  }
}
