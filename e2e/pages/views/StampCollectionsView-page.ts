import { Page } from '@playwright/test'
import { AbstractNamedViewPage } from './AbstractNamedView-page.js'
import { StampCollectionEditorCmp } from '../components/StampCollectionEditor-cmp.js'

export class StampCollectionsViewPage extends AbstractNamedViewPage<StampCollectionEditorCmp> {
  constructor(page: Page) {
    super(page)
  }

  getModelName(): string {
    return 'stampCollection'
  }

  newEditorInstance(): StampCollectionEditorCmp {
    return new StampCollectionEditorCmp(this.page)
  }
  getCreateAction(): string {
    return 'New Stamp Collection'
  }
  getPageURL(): string {
    return '/#/stampCollections'
  }
}
