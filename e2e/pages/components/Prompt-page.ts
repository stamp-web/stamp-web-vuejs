import { Page } from '@playwright/test'

export class PromptPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private getLocator() {
    return this.page.locator('.swal2-modal.swal2-show')
  }

  getMessage() {
    return this.getLocator().locator('#swal2-html-container').textContent()
  }
  yes() {
    return this.getLocator().locator('button:text("Yes")').click()
  }
  no() {
    return this.getLocator().locator('button:text("No")').click()
  }

  isVisible() {
    return this.getLocator().isVisible()
  }
}
