import { Locator, Page } from '@playwright/test'

export abstract class AbstractNamedEditorCmp {
  protected readonly page: Page
  // @ts-ignore
  protected editorLocator: Locator

  constructor(page: Page) {
    this.page = page
  }

  protected getLocator() {
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
    return this.getLocator().locator('div.form-color-danger').first().isVisible()
  }

  async isValid() {
    const count = await this.getLocator().locator('div.form-color-danger').count()
    return count === 0
  }
}
