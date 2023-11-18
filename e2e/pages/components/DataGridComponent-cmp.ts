import { Locator, Page } from '@playwright/test'

export class DataGridComponentCmp {
  readonly page: Page
  // @ts-ignore
  tableLocator: Locator
  constructor(page: Page) {
    this.page = page
  }

  private getTableLocator(): Locator {
    if (!this.tableLocator) {
      this.tableLocator = this.page.locator('div.ag-theme-stamp-web')
    }
    return this.tableLocator
  }

  private getTableRowViewportLocator(): Locator {
    return this.getTableLocator().locator('div.ag-body-viewport')
  }

  private getTableLoadingLocator(): Locator {
    return this.getTableLocator().locator('.ag-overlay-loading-center')
  }

  isLoading() {
    return this.getTableLocator().evaluate((el) =>
      el.classList.contains('grid-loading-true')
    )
  }

  async waitForLoadingComplete() {
    if (await this.isLoading()) {
      await this.page.waitForSelector('.grid-loading-false')
    }
  }

  getRowCount(): Promise<Number> {
    return this.getTableLocator()
      .locator('div.ag-body-viewport ')
      .getByRole('row')
      .count()
  }

  getRowByText(text: string) {
    return this.getTableLocator().getByRole('gridcell').getByText(text).locator('..')
  }

  getAction(icon: string, rowLocator: Locator) {
    return rowLocator.locator(`.icon-cell.${icon}`)
  }
}
