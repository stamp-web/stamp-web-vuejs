import { Locator, Page } from '@playwright/test'
import { DataGridComponentCmp } from '../components/DataGridComponent-cmp'
import { FilterInputCmp } from '../components/FilterInput-cmp'
import { CountryEditorCmp } from '../components/CountryEditor-cmp'

export class CountryViewPage {
  readonly page: Page
  // @ts-ignore
  private grid: DataGridComponentCmp
  // @ts-ignore
  private editor: CountryEditorCmp
  // @ts-ignore
  private filter: FilterInputCmp

  constructor(page: Page) {
    this.page = page
  }

  getGrid(): DataGridComponentCmp {
    if (!this.grid) {
      this.grid = new DataGridComponentCmp(this.page)
    }
    return this.grid
  }

  getEditor(): CountryEditorCmp {
    if (!this.editor) {
      this.editor = new CountryEditorCmp(this.page)
    }
    return this.editor
  }

  getFilter(): FilterInputCmp {
    if (!this.filter) {
      this.filter = new FilterInputCmp(this.page, 'filter-input')
    }
    return this.filter
  }

  getCreateButton(): Locator {
    return this.page.locator('button span:text("New Country")')
  }

  getDeleteButton(): Locator {
    return this.page.locator('button span:text("Delete")')
  }

  async goto() {
    await this.page.goto('/#/countries')
    await this.getGrid().waitForLoadingComplete()
  }

  getCount(): Promise<Number> {
    return this.getGrid().getRowCount()
  }
}
