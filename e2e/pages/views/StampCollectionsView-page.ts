import { Locator, Page } from '@playwright/test'
import { DataGridComponentCmp } from '../components/DataGridComponent-cmp'
import { StampCollectionEditorCmp } from '../components/StampCollectionEditor-cmp'
import { FilterInputCmp } from '../components/FilterInput-cmp'

export class StampCollectionsViewPage {
  readonly page: Page
  // @ts-ignore
  private grid: DataGridComponentCmp
  // @ts-ignore
  private editor: StampCollectionEditorCmp
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

  getEditor(): StampCollectionEditorCmp {
    if (!this.editor) {
      this.editor = new StampCollectionEditorCmp(this.page)
    }
    return this.editor
  }

  getFilter(): FilterInputCmp {
    if (!this.filter) {
      this.filter = new FilterInputCmp(this.page, 'file-input')
    }
    return this.filter
  }

  getCreateButton(): Locator {
    return this.page.locator('button span:text("New Stamp Collection")')
  }

  getDeleteButton(): Locator {
    return this.page.locator('button span:text("Delete")')
  }

  async goto() {
    await this.page.goto('/#/stampCollections')
    await this.getGrid().waitForLoadingComplete()
  }

  getCount(): Promise<Number> {
    return this.getGrid().getRowCount()
  }
}
