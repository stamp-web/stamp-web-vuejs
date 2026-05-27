import { Locator, Page } from '@playwright/test'

export class DataGridComponentCmp {
  readonly page: Page
  tableLocator!: Locator
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
    return this.getTableLocator().evaluate((el) => el.classList.contains('grid-loading-true'))
  }

  async waitForLoadingComplete(): Promise<void> {
    if (await this.isLoading()) {
      await this.page.waitForSelector('.grid-loading-false')
    }
    return this.page.waitForTimeout(500)
  }

  getRowCount(): Promise<number> {
    return this.getTableRowViewportLocator().getByRole('row').count()
  }

  getRow(index: number): Locator {
    return this.getTableRowViewportLocator().getByRole('row').nth(index)
  }

  getRowByText(text: string): Locator {
    return this.getTableLocator().getByRole('gridcell').locator(`text=${text}`).locator('..')
  }

  getCellLocatorByText(text: string): Locator {
    return this.getTableLocator().getByRole('gridcell').locator(`text='${text}'`)
  }

  getColumnById(row: Locator, colId: string): Locator {
    return row.locator(`[col-id="${colId}"]`)
  }

  getAction(icon: string, rowLocator: Locator): Locator {
    return rowLocator.locator(`.icon-cell.${icon}`)
  }
}
