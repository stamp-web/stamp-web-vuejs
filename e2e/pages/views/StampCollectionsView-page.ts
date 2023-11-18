import { Locator, Page } from '@playwright/test'
import { DataGridComponentPage } from '../components/DataGridComponent-page'
import { StampCollectionEditorPage } from '../components/StampCollectionEditor-page'
import { FilterInputPage } from '../components/FilterInput-page'

export class StampCollectionsViewPage {
  readonly page: Page
  // @ts-ignore
  private grid: DataGridComponentPage
  // @ts-ignore
  private editor: StampCollectionEditorPage
  // @ts-ignore
  private filter: FilterInputPage

  constructor(page: Page) {
    this.page = page
  }

  getGrid(): DataGridComponentPage {
    if (!this.grid) {
      this.grid = new DataGridComponentPage(this.page)
    }
    return this.grid
  }

  getEditor(): StampCollectionEditorPage {
    if (!this.editor) {
      this.editor = new StampCollectionEditorPage(this.page)
    }
    return this.editor
  }

  getFilter(): FilterInputPage {
    if (!this.filter) {
      this.filter = new FilterInputPage(this.page, 'file-input')
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
