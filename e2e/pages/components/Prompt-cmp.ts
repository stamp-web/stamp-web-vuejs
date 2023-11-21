import { Page } from '@playwright/test'

export class PromptCmp {
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

  async isVisible() {
    // There seems to be a lag especically in emulated browsers like the firefox simulator
    // in displaying the dialog.  This may have to do with the restyling from sweetalert color
    // scheme to the app theme.  Placing a timeout here (on the visible check) which is typically being
    // done as part of the flow seems to alleviate this issue.
    await this.page.waitForTimeout(500)
    return this.getLocator().isVisible()
  }
}
