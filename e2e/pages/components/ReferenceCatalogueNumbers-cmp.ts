import { Locator, Page } from '@playwright/test'
import { SelectCmp } from './Select-cmp.js'
import { encodeId } from '../../helpers/test-utils.js'

export class ReferenceCatalogueNumbersCmp {
  protected readonly page: Page
  protected panelLocator!: Locator

  constructor(page: Page) {
    this.page = page
  }

  private getLocator(): Locator {
    if (!this.panelLocator) {
      this.panelLocator = this.page.locator('.panel-form')
    }
    return this.panelLocator
  }

  getAddCatalogueNumberButton(): Locator {
    return this.getLocator().locator("button:has-text('Add Catalogue Number')")
  }

  getCatalogue(): SelectCmp {
    return new SelectCmp(this.page, 'group-cn-details.catalogueRef')
  }

  getCondition(): SelectCmp {
    return new SelectCmp(this.page, 'group-cn-details.condition', false)
  }

  getCatalogueNumber(): Locator {
    return this.getLocator().locator(
      `input[id="${encodeId('group-cn-details.number')}"]`
    )
  }

  getCatalogueValue(): Locator {
    return this.getLocator().locator(
      `input[id="${encodeId('group-cn-details.group-value.value')}"]`
    )
  }

  getCatalogueUnknown(): Locator {
    return this.getLocator().locator(`input[id="${encodeId('group-cn-details.unknown')}"]`)
  }

  getCatalogueNoSpace(): Locator {
    return this.getLocator().locator(`input[id="${encodeId('group-cn-details.nospace')}"]`)
  }

  getSaveButton(): Locator {
    return this.getLocator().locator('button:has-text("Save")')
  }

  getCancelButton(): Locator {
    return this.getLocator().locator('button:has-text("Cancel")')
  }

  getItem(text: string): Locator {
    return this.getLocator().locator('.flex-grow div').filter({ hasText: text }).first()
  }

  getDeleteButtonForItem(itemText: string): Locator {
    return this.getItem(itemText).locator('.sw-icon-delete')
  }
}
