import { Page } from '@playwright/test'
import { AbstractNamedEditorCmp } from './AbstractNamedEditor'

export class CountryEditorCmp extends AbstractNamedEditorCmp {
  constructor(page: Page) {
    super(page)
  }
}
