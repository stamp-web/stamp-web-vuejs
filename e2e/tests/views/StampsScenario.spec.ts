import { test, expect, Page } from '@playwright/test'
import {
  AlbumTestHelper,
  CatalogueTestHelper,
  CountryTestHelper,
  SellerTestHelper,
  StampCollectionTestHelper
} from '../../helpers/api-helpers.js'
import { CountryViewPage } from '../../pages/views/CountryView-page.js'
import { StampViewPage } from '../../pages/views/StampView-page.js'
import { SelectCmp } from '../../pages/components/Select-cmp.js'

test.describe('creation tests', () => {
  let countryView: CountryViewPage
  let stampView: StampViewPage
  let albumName: string
  let collectionName: string
  let catalogueName: string
  let countryName: string
  let sellerName: string
  let timestamp: number

  test.beforeEach(async ({ request }) => {
    timestamp = new Date().getTime()
    catalogueName = `createStamp-${timestamp}`
    countryName = `createStamp-${timestamp}`
    albumName = `createStamp-${timestamp}`
    collectionName = `collectionAlbum-${timestamp}`
    sellerName = `createStamp-${timestamp}`
    await CountryTestHelper.create(request, { name: countryName })
    await CatalogueTestHelper.create(request, { name: catalogueName, issue: '2024', type: 1 })
    const sc = await StampCollectionTestHelper.create(request, { name: collectionName })
    await AlbumTestHelper.create(request, { name: albumName, stampCollectionRef: sc.id })
    await SellerTestHelper.create(request, { name: sellerName })
  })

  test.afterEach(async ({ request }) => {
    await AlbumTestHelper.deleteByName(request, albumName)
    await StampCollectionTestHelper.deleteByName(request, collectionName)
    await CountryTestHelper.deleteByName(request, countryName)
    await CatalogueTestHelper.deleteByName(request, catalogueName)
    await SellerTestHelper.deleteByName(request, sellerName)
  })

  async function navigateToStampView(page: Page, countryName: string) {
    const countryView = new CountryViewPage(page)
    await countryView.goto()
    await countryView.getFilter().getInput().fill(countryName)
    await countryView.getGrid().waitForLoadingComplete()
    const selectedRow = countryView.getGrid().getRowByText(countryName)
    await countryView.getGrid().getAction('sw-icon-search', selectedRow).click()
    const stampView = new StampViewPage(page)
    return stampView
  }

  test('create wantlist', async ({ page }) => {
    const stampView = await navigateToStampView(page, countryName)
    await stampView.getCreateWantListButton().click()
    const num = `23a-${timestamp}`
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

  test('create stamp (full field test)', async ({ page }) => {
    const stampView = await navigateToStampView(page, countryName)
    await stampView.getCreateStampButton().click()
    const num = `B46-${timestamp}`
    const editor = stampView.getEditor()
    await expect(editor.getTitle()).toHaveText('New Stamp')
    await editor.getCountry().select(countryName)
    await editor.getRate().fill('3d')
    await editor.getDescription().fill(`orange - ${timestamp}`)
    await editor.getCatalogue().select(catalogueName)
    await editor.getCatalogueCondition().select('Mint')
    await editor.getCatalogueNumber().fill(num)
    await editor.getCatalogueValue().fill('25.54')
    await editor.getCatalogueNoSpace().check()

    await editor.getOwnershipAlbum().select(albumName)
    await editor.getOwnershipCondition().select('Mint')
    await editor.getOwnershipGrade().select('Fine (F)')
    await editor.getOwnershipSeller().select(sellerName)
    await editor.getOwnershipImagePath().fill(`${countryName}/${num}.jpg`)
    expect(await editor.isValid()).toBe(true)
    await editor.getSaveButton().click()
    await stampView.getGrid().getRowByText(num)
  })
})
