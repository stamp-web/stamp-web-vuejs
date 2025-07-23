import { Locator, Page } from '@playwright/test'
import { encodeId } from '../../helpers/test-utils.js'
import { SelectCmp } from './Select-cmp.js'

export class StampPurchaseDialogCmp {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  getLocator(): Locator {
    return this.page.locator('#stamp-purchase-dialog')
  }

  isVisible(shown = true): Promise<boolean> {
    return shown ? this.getLocator().isVisible() : this.getLocator().isHidden()
  }

  getTitle(): Locator {
    return this.getLocator().locator('h3')
  }

  getPricePaid(): Locator {
    return this.getLocator().locator(`input[id="${encodeId('group-price.pricePaid')}"]`)
  }

  getCurrencyCode(): SelectCmp {
    return new SelectCmp(this.page, 'group-price.code', false)
  }

  getCalculatedCostMessage(): Locator {
    return this.getLocator().locator('#calculated-cost')
  }

  getSaveButton() {
    return this.getLocator().locator('button span:text("Save")')
  }

  getCancelButton() {
    return this.getLocator().locator('button span:text("Cancel")')
  }
}
