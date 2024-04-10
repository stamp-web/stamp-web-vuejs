import { Page } from '@playwright/test'
import { AlbumEditorCmp } from '../components/AlbumEditor-cmp'
import { AbstractNamedViewPage } from './AbstractNamedView-page'

export class AlbumViewPage extends AbstractNamedViewPage<AlbumEditorCmp> {
  constructor(page: Page) {
    super(page)
  }

  newEditorInstance(): AlbumEditorCmp {
    return new AlbumEditorCmp(this.page)
  }
  getCreateAction(): string {
    return 'New Album'
  }
  getPageURL(): string {
    return '/#/albums'
  }
}
