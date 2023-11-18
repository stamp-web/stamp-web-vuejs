import { Locator, Page } from '@playwright/test'

export class StampCollectionEditorPage {
  readonly page: Page
  // @ts-ignore
  editorLocator: Locator

  constructor(page: Page) {
    this.page = page
  }

  private getLocator() {
    if (!this.editorLocator) {
      this.editorLocator = this.page.getByRole('form')
    }
    return this.editorLocator
  }

  getTitle() {
    return this.getLocator().locator('.panel-form-title')
  }

  getName() {
    return this.getLocator().locator('input[aria-labelledby="name__label"]')
  }

  getDescription() {
    return this.getLocator().locator('textarea[id="description"]')
  }

  getSaveButton() {
    return this.getLocator().locator('button span:text("Save")')
  }

  getCancelButton() {
    return this.getLocator().locator('button span:text("Cancel")')
  }

  isInvalid() {
    return this.getLocator().locator('div.form-bg-danger').isVisible()
  }

  async isValid() {
    const count = await this.getLocator().locator('div.form-bg-danger').count()
    return count === 0
  }
}
