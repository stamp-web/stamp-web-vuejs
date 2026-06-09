import { Locator, Page } from '@playwright/test'
import { DataGridComponentCmp } from '../components/DataGridComponent-cmp.js'
import { StampEditorCmp } from '../components/StampEditor-cmp.js'
import { ReferenceCatalogueNumbersCmp } from '../components/ReferenceCatalogueNumbers-cmp.js'

export class StampViewPage {
  readonly page: Page

  private grid!: DataGridComponentCmp
  private editor!: StampEditorCmp
  private referencesPanel!: ReferenceCatalogueNumbersCmp

  constructor(page: Page) {
    this.page = page
  }

  getGrid(): DataGridComponentCmp {
    if (!this.grid) {
      this.grid = new DataGridComponentCmp(this.page)
    }
    return this.grid
  }

  async goto(filter = '') {
    const encodedFilter = encodeURIComponent(filter).replace(/%20/g, '+')
    await this.page.goto(`/#/stamps${filter === '' ? '' : '?$filter=' + encodedFilter}`)
    await this.getGrid().waitForLoadingComplete()
  }

  getEditor(): StampEditorCmp {
    if (!this.editor) {
      this.editor = new StampEditorCmp(this.page)
    }
    return this.editor
  }

  getCount(): Promise<number> {
    return this.getGrid().getRowCount()
  }

  getCreateStampButton(): Locator {
    return this.page.locator(`button[id='create-stamp']`)
  }

  getCreateWantListButton(): Locator {
    return this.page.locator(`button[id='create-wantList']`)
  }

  getPurchaseButton(): Locator {
    return this.page.locator(`button[id='btn-purchased']`)
  }

  getUpdateCatalogueButton(): Locator {
    return this.page.locator(`button[id='btn-update-catalogue']`)
  }

  getReferencesButton(): Locator {
    return this.page.locator(`button[id='btn-references']`)
  }

  getReferencesPanel(): ReferenceCatalogueNumbersCmp {
    if (!this.referencesPanel) {
      this.referencesPanel = new ReferenceCatalogueNumbersCmp(this.page)
    }
    return this.referencesPanel
  }
}
