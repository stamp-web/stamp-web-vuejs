import { Page } from '@playwright/test'

export class FilterInputPage {
  readonly page: Page
  readonly clazz: string

  constructor(page: Page, clazz: string) {
    this.page = page
    this.clazz = clazz
  }

  private getLocator() {
    return this.page.locator(`form.${this.clazz}`)
  }

  getInput() {
    return this.getLocator().locator('input[name="text"]')
  }

  clear() {
    return this.getLocator().locator('span.sw-icon-cancel').click()
  }
}
