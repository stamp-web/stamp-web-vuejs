import { Page } from '@playwright/test'
import { CountryEditorCmp } from '../components/CountryEditor-cmp.js'
import { AbstractNamedViewPage } from './AbstractNamedView-page.js'

export class CountryViewPage extends AbstractNamedViewPage<CountryEditorCmp> {
  constructor(page: Page) {
    super(page)
  }

  getModelName(): string {
    return 'country'
  }

  newEditorInstance(): CountryEditorCmp {
    return new CountryEditorCmp(this.page)
  }
  getCreateAction(): string {
    return 'New Country'
  }
  getPageURL(): string {
    return '/#/countries'
  }
}
