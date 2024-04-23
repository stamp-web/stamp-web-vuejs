import { Locator, Page } from '@playwright/test'
import { DataGridComponentCmp } from '../components/DataGridComponent-cmp.js'
import { StampEditorCmp } from '../components/StampEditor-cmp.js'

export class StampViewPage {
  readonly page: Page
  // @ts-ignore
  private grid: DataGridComponentCmp
  // @ts-ignore
  private editor: StampEditorCmp

  constructor(page: Page) {
    this.page = page
  }

  getGrid(): DataGridComponentCmp {
    if (!this.grid) {
      this.grid = new DataGridComponentCmp(this.page)
    }
    return this.grid
  }

  async goto() {
    await this.page.goto('/#/stamps')
    await this.getGrid().waitForLoadingComplete()
  }

  getEditor(): StampEditorCmp {
    if (!this.editor) {
      this.editor = new StampEditorCmp(this.page)
    }
    return this.editor
  }

  getCount(): Promise<Number> {
    return this.getGrid().getRowCount()
  }

  getCreateStampButton(): Locator {
    return this.page.locator(`button[id='create-stamp']`)
  }

  getCreateWantListButton(): Locator {
    return this.page.locator(`button[id='create-wantList']`)
  }
}
