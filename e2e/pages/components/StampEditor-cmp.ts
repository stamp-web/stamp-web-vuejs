import { Locator, Page } from '@playwright/test'
import { SelectCmp } from './Select-cmp.js'
import { encodeId } from '../../helpers/test-utils.js'

export class StampEditorCmp {
  protected readonly page: Page
  // @ts-ignore
  protected editorLocator: Locator

  constructor(page: Page) {
    this.page = page
  }

  private getLocator() {
    if (!this.editorLocator) {
      this.editorLocator = this.page.locator('.panel-form')
    }
    return this.editorLocator
  }

  getTitle() {
    return this.getLocator().locator('.panel-form-title')
  }

  getCountry(): SelectCmp {
    return new SelectCmp(this.page, 'group-stamp-details.countryRef')
  }
  getRate() {
    return this.getLocator().locator(`input[id="${encodeId('group-stamp-details.rate')}"]`)
  }
  getDescription() {
    return this.getLocator().locator(`input[id="${encodeId('group-stamp-details.description')}"]`)
  }

  getCatalogue(): SelectCmp {
    return new SelectCmp(this.page, 'group-cn-details.catalogueRef')
  }

  getCatalogueCondition(): SelectCmp {
    return new SelectCmp(this.page, 'group-cn-details.condition', false)
  }

  getCatalogueNumber(): Locator {
    return this.getLocator().locator(`input[id="${encodeId('group-cn-details.number')}"]`)
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

  getOwnershipAlbum(): SelectCmp {
    return new SelectCmp(this.page, 'group-stamp-ownership.albumRef')
  }

  getOwnershipCondition(): SelectCmp {
    return new SelectCmp(this.page, 'group-stamp-ownership.condition', false)
  }

  getOwnershipGrade(): SelectCmp {
    return new SelectCmp(this.page, 'group-stamp-ownership.grade', false)
  }

  getOwnershipSeller(): SelectCmp {
    return new SelectCmp(this.page, 'group-stamp-ownership.sellerRef')
  }

  getOwnershipImagePath(): Locator {
    return this.getLocator().locator(
      'input[name="img"]'
      //`input[id="${encodeId('group-stamp-ownership.group-image-path.img')}"]`
    )
  }

  getSaveButton() {
    return this.getLocator().locator('button span:text("Save")', { hasText: /^Save$/ })
  }

  getSaveAndNewButton() {
    return this.getLocator().locator('button span:text("Save and new")')
  }

  getCancelButton() {
    return this.getLocator().locator('button span:text("Cancel")')
  }

  isInvalid() {
    return this.getLocator().locator('div.form-color-danger').isVisible()
  }

  async isValid() {
    const count = await this.getLocator().locator('div.form-color-danger').count()
    return count === 0
  }
}