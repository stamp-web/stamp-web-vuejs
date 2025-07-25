import { Locator, Page } from '@playwright/test'
import { DataGridComponentCmp } from '../components/DataGridComponent-cmp.js'
import { FilterInputCmp } from '../components/FilterInput-cmp.js'
import { AbstractNamedEditorCmp } from '../components/AbstractNamedEditor.js'

export abstract class AbstractNamedViewPage<T extends AbstractNamedEditorCmp> {
  protected readonly page: Page
  protected grid: DataGridComponentCmp | null = null
  protected editor: T | null = null
  protected filter: FilterInputCmp | null = null

  constructor(page: Page) {
    this.page = page
  }

  abstract newEditorInstance(): T
  abstract getModelName(): string
  abstract getCreateAction(): string
  abstract getPageURL(): string

  getGrid(): DataGridComponentCmp {
    if (!this.grid) {
      this.grid = new DataGridComponentCmp(this.page)
    }
    return this.grid
  }

  getEditor(): T {
    if (!this.editor) {
      this.editor = this.newEditorInstance()
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
    return this.page.locator(`button span:text("${this.getCreateAction()}")`)
  }

  getDeleteButton(): Locator {
    return this.page.locator(`button[id="delete-${this.getModelName()}"]`)
  }

  async goto(): Promise<void> {
    await this.page.goto(this.getPageURL())
    await this.getGrid().waitForLoadingComplete()
  }

  getCount(): Promise<number> {
    return this.getGrid().getRowCount()
  }
}
