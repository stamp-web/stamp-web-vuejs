import { Page } from '@playwright/test'
import { AbstractNamedEditorCmp } from './AbstractNamedEditor'

export class SellerEditorCmp extends AbstractNamedEditorCmp {
  constructor(page: Page) {
    super(page)
  }
}
