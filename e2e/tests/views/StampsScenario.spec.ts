import { expect, Page, test } from '@playwright/test'
import {
  AlbumTestHelper,
  CatalogueTestHelper,
  CountryTestHelper,
  SellerTestHelper,
  StampCollectionTestHelper,
  StampTestHelper
} from '../../helpers/api-helpers.js'
import { CountryViewPage } from '../../pages/views/CountryView-page.js'
import { StampViewPage } from '../../pages/views/StampView-page.js'
import { StampPurchaseDialogCmp } from '../../pages/components/StampPurchaseDialog-cmp.js'
import { PromptCmp } from '../../pages/components/Prompt-cmp.js'

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

test.describe('purchase tests', () => {
  let albumName: string
  let collectionName: string
  let catalogueName: string
  let countryName: string
  let timestamp: number
  let albumId: number
  let countryId: number
  let catalogueId: number

  test.beforeEach(async ({ request }) => {
    timestamp = new Date().getTime() + Math.floor(Math.random() * 100)
    catalogueName = `createStamp-${timestamp}`
    countryName = `createStamp-${timestamp}`
    albumName = `createStamp-${timestamp}`
    collectionName = `collectionAlbum-${timestamp}`

    countryId = (await CountryTestHelper.create(request, { name: countryName })).id
    catalogueId = (
      await CatalogueTestHelper.create(request, { name: catalogueName, issue: '2024', type: 1 })
    ).id
    const sc = await StampCollectionTestHelper.create(request, { name: collectionName })
    albumId = (
      await AlbumTestHelper.create(request, { name: albumName, stampCollectionRef: sc.id })
    ).id
  })

  test.afterEach(async ({ request }) => {
    await AlbumTestHelper.deleteByName(request, albumName)
    await StampCollectionTestHelper.deleteByName(request, collectionName)
    await CountryTestHelper.deleteByName(request, countryName)
    await CatalogueTestHelper.deleteByName(request, catalogueName)
  })

  test('verify basic purchase', async ({ page }) => {
    const num = `23a-${timestamp}`
    StampTestHelper.create(page.request, {
      countryRef: countryId,
      rate: '1d',
      description: 'red',
      wantList: false,
      catalogueNumbers: [
        {
          catalogueRef: catalogueId,
          number: num,
          value: 100,
          condition: 2,
          active: true
        }
      ],
      stampOwnerships: [
        {
          albumRef: albumId,
          condition: 2,
          grade: 0,
          pricePaid: 100,
          code: 'CAD'
        }
      ]
    })
    const stampView = await navigateToStampView(page, countryName)
    await stampView.getGrid().waitForLoadingComplete()
    await stampView.getGrid().getRowByText(num).click({ delay: 500 })
    await expect(stampView.getPurchaseButton()).toBeEnabled()
    await stampView.getPurchaseButton().click()
    const purchaseDialog = new StampPurchaseDialogCmp(page)
    await expect(purchaseDialog.getLocator()).toBeVisible({ timeout: 500 })
    await expect(purchaseDialog.getTitle()).toHaveText('Set Purchase Price')
    await expect(purchaseDialog.getSaveButton()).toBeDisabled()
    await purchaseDialog.getPricePaid().fill('50')
    await purchaseDialog.getCurrencyCode().select('EUR')
    await expect(purchaseDialog.getCalculatedCostMessage()).toHaveText(
      'Cost Basis is 50.00% for 1 stamp'
    )
    await expect(purchaseDialog.getSaveButton()).toBeEnabled()

    await purchaseDialog.getSaveButton().click()
    await stampView.getGrid().getRowByText(num).click({ delay: 500 })
    await expect(await stampView.getGrid().getCellLocatorByText('€50.00')).toHaveText('€50.00')
    const rowLoc = await stampView.getGrid().getRowByText(num)
    await stampView.getGrid().getAction('sw-icon-edit', rowLoc).click()
    const editor = await stampView.getEditor()
    await editor.getOwnershipPricePaid().scrollIntoViewIfNeeded()
    expect(await editor.getOwnershipCurrency().getText()).toBe('EUR')
    await expect(await editor.getOwnershipPricePaid()).toHaveValue('50')
  })
})
test.describe('creation tests', () => {
  let albumName: string
  let collectionName: string
  let catalogueName: string
  let countryName: string
  let sellerName: string
  let timestamp: number
  let countryId: number
  let catalogueId: number

  test.beforeEach(async ({ request }) => {
    timestamp = new Date().getTime() + Math.floor(Math.random() * 100)
    catalogueName = `createStamp-${timestamp}`
    countryName = `createStamp-${timestamp}`
    albumName = `createStamp-${timestamp}`
    collectionName = `collectionAlbum-${timestamp}`
    sellerName = `createStamp-${timestamp}`

    countryId = (await CountryTestHelper.create(request, { name: countryName })).id
    catalogueId = (
      await CatalogueTestHelper.create(request, { name: catalogueName, issue: '2024', type: 1 })
    ).id
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

  test('create wantlist', async ({ page }) => {
    const stampView = await navigateToStampView(page, countryName)
    await stampView.getCreateWantListButton().click()
    const num = `23a-${timestamp}`
    const editor = stampView.getEditor()
    await expect(editor.getTitle()).toHaveText('New Wantlist Stamp')
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

  test('convert wantlist', async ({ page }) => {
    const num = `56a-${timestamp}`
    StampTestHelper.create(page.request, {
      countryRef: countryId,
      rate: '1d',
      description: 'red',
      wantList: true,
      catalogueNumbers: [
        {
          catalogueRef: catalogueId,
          number: num,
          value: 12.5,
          condition: 2,
          active: true
        }
      ]
    })

    const stampView = await navigateToStampView(page, countryName)
    await stampView.getGrid().waitForLoadingComplete()
    const rowLoc = await stampView.getGrid().getRowByText(num)
    await stampView.getGrid().getAction('sw-icon-edit', rowLoc).click()
    const editor = stampView.getEditor()
    await expect(editor.getTitle()).toHaveText('Edit Wantlist Stamp')
    await editor.getConvertButton().click()
    await expect(editor.getTitle()).toHaveText('Edit Stamp')
    await editor.getOwnershipAlbum().select(albumName)
    await editor.getOwnershipCondition().select('Mint')
    await editor.getOwnershipGrade().select('Fine (F)')
    await editor.getOwnershipSeller().select(sellerName)
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

  test('verify conflict', async ({ page }) => {
    const num = `45a-${timestamp}`
    StampTestHelper.create(page.request, {
      countryRef: countryId,
      rate: '1d',
      description: 'red',
      wantList: true,
      catalogueNumbers: [
        {
          catalogueRef: catalogueId,
          number: num,
          value: 12.5,
          condition: 2,
          active: true
        }
      ]
    })
    const stampView = await navigateToStampView(page, countryName)
    await stampView.getCreateWantListButton().click()
    const editor = stampView.getEditor()
    await expect(editor.getTitle()).toHaveText('New Wantlist Stamp')
    await editor.getCountry().select(countryName)
    await editor.getRate().fill('1d')
    await editor.getDescription().fill(`wantlist description - ${timestamp}`)
    await editor.getCatalogue().select(catalogueName)
    await editor.getCatalogueCondition().select('Used')
    await editor.getCatalogueNumber().fill(num)
    await editor.getCatalogueValue().fill('12.50')
    expect(await editor.isValid()).toBe(true)
    expect(await editor.hasConflict()).toBe(true)
  })

  test('verify reference catalogue numbers panel and add crash', async ({ page }) => {
    page.on('console', (msg) => {
      // eslint-disable-next-line no-console
      console.log(`CONSOLE [${msg.type()}]: ${msg.text()}`)
    })
    page.on('pageerror', (err) => {
      // eslint-disable-next-line no-console
      console.log(`PAGE ERROR: ${err.message}\n${err.stack}`)
    })

    const num = `refcn-${timestamp}`
    StampTestHelper.create(page.request, {
      countryRef: countryId,
      rate: '1d',
      description: 'red',
      wantList: false,
      catalogueNumbers: [
        {
          catalogueRef: catalogueId,
          number: num,
          value: 100,
          condition: 2,
          active: true
        }
      ]
    })
    const stampView = await navigateToStampView(page, countryName)
    await stampView.getGrid().waitForLoadingComplete()

    const rowLoc = await stampView.getGrid().getRowByText(num)
    await rowLoc.click({ delay: 500 })

    const refBtn = stampView.getReferencesButton()
    await expect(refBtn).toBeEnabled()
    await refBtn.click()

    const refPanel = stampView.getReferencesPanel()
    const addBtn = refPanel.getAddCatalogueNumberButton()
    await expect(addBtn).toBeVisible()
    await addBtn.click()

    await expect(refPanel.getCancelButton().first()).toBeVisible()
  })

  test('verify reference catalogue number deletion', async ({ page }) => {
    const numActive = `activecn-${timestamp}`
    const numRef = `refcn-del-${timestamp}`
    await StampTestHelper.create(page.request, {
      countryRef: countryId,
      rate: '1d',
      description: 'red',
      wantList: false,
      catalogueNumbers: [
        {
          catalogueRef: catalogueId,
          number: numActive,
          value: 100,
          condition: 2,
          active: true
        },
        {
          catalogueRef: catalogueId,
          number: numRef,
          value: 50,
          condition: 2,
          active: false
        }
      ]
    })
    const stampView = await navigateToStampView(page, countryName)
    await stampView.getGrid().waitForLoadingComplete()

    const rowLoc = await stampView.getGrid().getRowByText(numActive)
    await rowLoc.click({ delay: 500 })

    const refBtn = stampView.getReferencesButton()
    await expect(refBtn).toBeEnabled()
    await refBtn.click()

    // Check both are visible in the reference catalogue numbers panel
    const refPanel = stampView.getReferencesPanel()
    const activeItem = refPanel.getItem(numActive)
    await expect(activeItem).toBeVisible()
    const refItem = refPanel.getItem(numRef)
    await expect(refItem).toBeVisible()

    // Find the delete button for the secondary catalogue number
    const deleteBtn = refPanel.getDeleteButtonForItem(numRef)
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    // Confirm deletion
    const prompt = new PromptCmp(page)
    await expect(prompt.getLocator()).toBeVisible()
    await prompt.yes()
    await expect(prompt.getLocator()).toBeHidden()

    // Verify the secondary catalogue number is gone from the slide out view
    await expect(refItem).toBeHidden()
  })
})
