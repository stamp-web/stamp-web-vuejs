import { Page } from '@playwright/test'
import { CountryEditorCmp } from '../components/CountryEditor-cmp'
import { AbstractNamedViewPage } from './AbstractNamedView-page'

export class CountryViewPage extends AbstractNamedViewPage<CountryEditorCmp> {
  constructor(page: Page) {
    super(page)
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
