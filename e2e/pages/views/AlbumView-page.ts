import { Locator, Page } from '@playwright/test'
import { DataGridComponentCmp } from '../components/DataGridComponent-cmp'
import { AlbumEditorCmp } from '../components/AlbumEditor-cmp'
import { FilterInputCmp } from '../components/FilterInput-cmp'

export class AlbumViewPage {
  readonly page: Page
  // @ts-ignore
  private grid: DataGridComponentCmp
  // @ts-ignore
  private editor: AlbumEditorCmp
  // @ts-ignore
  private filter: FilterInputCmp

  constructor(page: Page) {
    this.page = page
  }

  getGrid(): DataGridComponentCmp {
    if (!this.grid) {
      this.grid = new DataGridComponentCmp(this.page)
    }
    return this.grid
  }

  getEditor(): AlbumEditorCmp {
    if (!this.editor) {
      this.editor = new AlbumEditorCmp(this.page)
    }
    return this.editor
  }

  getFilter(): FilterInputCmp {
    if (!this.filter) {
      this.filter = new FilterInputCmp(this.page, 'filter-input')
    }
    return this.filter
  }

  getCreateButton(): Locator {
    return this.page.locator('button span:text("New Album")')
  }

  getDeleteButton(): Locator {
    return this.page.locator('button span:text("Delete")')
  }

  async goto() {
    await this.page.goto('/#/albums')
    await this.getGrid().waitForLoadingComplete()
  }

  getCount(): Promise<Number> {
    return this.getGrid().getRowCount()
  }
}
