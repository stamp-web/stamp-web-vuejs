import { Page } from '@playwright/test'
import { SellerEditorCmp } from '../components/SellerEditor-cmp.js'
import { AbstractNamedViewPage } from './AbstractNamedView-page.js'

export class SellerViewPage extends AbstractNamedViewPage<SellerEditorCmp> {
  constructor(page: Page) {
    super(page)
  }

  getModelName(): string {
    return 'seller'
  }

  newEditorInstance(): SellerEditorCmp {
    return new SellerEditorCmp(this.page)
  }
  getCreateAction(): string {
    return 'New Seller'
  }
  getPageURL(): string {
    return '/#/sellers'
  }
}
