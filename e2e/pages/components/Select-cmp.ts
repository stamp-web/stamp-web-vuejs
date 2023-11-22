import { Page } from '@playwright/test'

export class SelectCmp {
  readonly page: Page
  readonly prop: string

  constructor(page: Page, prop: string) {
    this.page = page
    this.prop = prop
  }

  private getLocator() {
    return this.page.locator(`#${this.prop}`)
  }

  getText(): Promise<string> {
    return this.getLocator()
      .getByRole('combobox')
      .locator('.overflow-ellipsis')
      .innerText()
  }

  async clear() {
    await this.getLocator().getByRole('combobox').getByRole('button').click()
  }
  async select(text: string) {
    await this.getLocator().click()
    // allow drop down to open
    this.page.waitForTimeout(500)
    await this.getLocator()
      .locator(`#${this.prop}-dropdown`)
      .getByRole('option')
      .getByText(text)
      .click()
  }
}
