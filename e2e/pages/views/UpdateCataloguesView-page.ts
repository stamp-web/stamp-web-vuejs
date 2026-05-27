import { BaseViewPage } from './BaseView-page.js'
import { Locator } from '@playwright/test'
import { SelectCmp } from '../components/Select-cmp.js'

export class UpdateCataloguesViewPage extends BaseViewPage {
  async goto(filter: string) {
    const encodedFilter = encodeURIComponent(filter).replace(/%20/g, '+')
    await this.page.goto(`/#/update-catalogues?$filter=${encodedFilter}`)
    await this.page.waitForURL(`**/update-catalogues?$filter=*`)
    await this.page.waitForTimeout(250)
  }

  getNewCatalogue(): SelectCmp {
    return new SelectCmp(this.page, 'newCatalogueRef', true)
  }

  getCurrentCatalogue(): SelectCmp {
    return new SelectCmp(this.page, 'currentCatalogueRef', true)
  }

  getUpdateButton(): Locator {
    return this.page.getByRole('button', { name: 'Update' })
  }
}
