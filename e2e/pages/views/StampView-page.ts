import { Page } from '@playwright/test'
import { DataGridComponentCmp } from '../components/DataGridComponent-cmp'

export class StampViewPage {
  readonly page: Page
  // @ts-ignore
  private grid: DataGridComponentCmp

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

  getCount(): Promise<Number> {
    return this.getGrid().getRowCount()
  }
}
