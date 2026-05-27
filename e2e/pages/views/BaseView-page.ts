import { Page } from '@playwright/test'
import { DataGridComponentCmp } from '../components/DataGridComponent-cmp.js'

export class BaseViewPage {
  readonly page: Page
  private grid!: DataGridComponentCmp

  constructor(page: Page) {
    this.page = page
  }

  getGrid() {
    if (!this.grid) {
      this.grid = new DataGridComponentCmp(this.page)
    }
    return this.grid
  }

  getSaveButton() {
    return this.page.locator('button span:text("Save")')
  }

  getCancelButton() {
    return this.page.locator('button span:text("Cancel")')
  }
}
