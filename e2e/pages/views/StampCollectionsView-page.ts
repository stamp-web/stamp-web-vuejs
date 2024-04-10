import { Page } from '@playwright/test'
import { AbstractNamedViewPage } from './AbstractNamedView-page'
import { StampCollectionEditorCmp } from '../components/StampCollectionEditor-cmp'

export class StampCollectionsViewPage extends AbstractNamedViewPage<StampCollectionEditorCmp> {
  constructor(page: Page) {
    super(page)
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
