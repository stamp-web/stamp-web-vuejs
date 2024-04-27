import { Page } from '@playwright/test'
import { AlbumEditorCmp } from '../components/AlbumEditor-cmp.js'
import { AbstractNamedViewPage } from './AbstractNamedView-page.js'

export class AlbumViewPage extends AbstractNamedViewPage<AlbumEditorCmp> {
  constructor(page: Page) {
    super(page)
  }

  getModelName(): string {
    return 'album'
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
