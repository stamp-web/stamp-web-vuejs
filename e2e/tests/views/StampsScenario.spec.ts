import { test, expect } from '@playwright/test'
import {
  AlbumTestHelper,
  CatalogueTestHelper,
  CountryTestHelper,
  StampCollectionTestHelper
} from '../../helpers/api-helpers.js'
import { CountryViewPage } from '../../pages/views/CountryView-page.js'
import { StampViewPage } from '../../pages/views/StampView-page.js'

test.describe('creation tests', () => {
  let countryView: CountryViewPage
  let stampView: StampViewPage
  let albumName: string
  let collectionName: string
  let catalogueName: string
  let countryName: string
  const timestamp = new Date().getTime()

  test.beforeEach(async ({ request }) => {
    catalogueName = `createStamp-${timestamp}`
    countryName = `createStamp-${timestamp}`
    albumName = `createStamp-${timestamp}`
    collectionName = `collectionAlbum-${timestamp}`
    await CountryTestHelper.create(request, { name: countryName })
    await CatalogueTestHelper.create(request, { name: catalogueName, issue: '2024', type: 1 })
    const sc = await StampCollectionTestHelper.create(request, { name: collectionName })
    await AlbumTestHelper.create(request, { name: albumName, stampCollectionRef: sc.id })
  })

  test.afterEach(async ({ request }) => {
    await AlbumTestHelper.deleteByName(request, albumName)
    await StampCollectionTestHelper.deleteByName(request, collectionName)
    await CountryTestHelper.deleteByName(request, countryName)
    await CatalogueTestHelper.deleteByName(request, catalogueName)
  })

  test('create wantlist', async ({ page }) => {
    countryView = new CountryViewPage(page)
    await countryView.goto()
    await countryView.getFilter().getInput().fill(countryName)
    await countryView.getGrid().waitForLoadingComplete()
    const selectedRow = countryView.getGrid().getRowByText(countryName)
    await countryView.getGrid().getAction('sw-icon-search', selectedRow).click()
    stampView = new StampViewPage(page)
    const btn = stampView.getCreateWantListButton()
    const num = `23a-${timestamp}`
    await btn.click()
    const editor = stampView.getEditor()
    await expect(editor.getTitle()).toHaveText('New Stamp')
    await editor.getCountry().select(countryName)
    await editor.getRate().fill('1d')
    await editor.getDescription().fill(`wantlist description - ${timestamp}`)
    await editor.getCatalogue().select(catalogueName)
    await editor.getCatalogueCondition().select('Mint (NH)')
    await editor.getCatalogueNumber().fill(num)
    await editor.getCatalogueValue().fill('12.50')
    expect(await editor.isValid()).toBe(true)
    await editor.getSaveButton().click()
    await stampView.getGrid().getRowByText(num)
  })
})
