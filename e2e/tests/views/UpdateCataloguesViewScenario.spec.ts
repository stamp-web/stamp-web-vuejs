import { expect, test } from '@playwright/test'
import {
  CatalogueTestHelper,
  CountryTestHelper,
  StampTestHelper
} from '../../helpers/api-helpers.js'
import { UpdateCataloguesViewPage } from '../../pages/views/UpdateCataloguesView-page.js'
import { StampViewPage } from '../../pages/views/StampView-page.js'
import { CatalogueViewPage } from '../../pages/views/CatalogueView-page.js'

test.describe('update catalogue values', () => {
  let countryName: string
  let fromCatalogueName: string
  let toCatalogueName: string
  let timestamp: number
  let countryId: number
  let fromCatalogueId: number

  test.beforeEach(async ({ request }) => {
    timestamp = new Date().getTime()
    countryName = `cat-country-${timestamp}`
    fromCatalogueName = `cat-from-${timestamp}`
    toCatalogueName = `cat-to-${timestamp}`

    countryId = (await CountryTestHelper.create(request, { name: countryName })).id
    fromCatalogueId = (
      await CatalogueTestHelper.create(request, {
        name: fromCatalogueName,
        issue: '2024',
        type: 2,
        code: 'EUR'
      })
    ).id
    await CatalogueTestHelper.create(request, {
      name: toCatalogueName,
      issue: '2025',
      type: 2,
      code: 'EUR'
    })

    for (let i = 1; i <= 3; i++) {
      await StampTestHelper.create(request, {
        countryRef: countryId,
        rate: `${i}d`,
        description: `stamp ${i}`,
        wantList: true,
        catalogueNumbers: [
          {
            catalogueRef: fromCatalogueId,
            number: `s${i}`,
            value: i * 10,
            condition: 2,
            active: true
          }
        ]
      })
    }
  })

  test.afterEach(async ({ request }) => {
    await CountryTestHelper.deleteByName(request, countryName)
    await CatalogueTestHelper.deleteByName(request, fromCatalogueName)
    await CatalogueTestHelper.deleteByName(request, toCatalogueName)
  })

  test('update catalogue values', async ({ page }) => {
    const updateView = new UpdateCataloguesViewPage(page)
    const filter = `(countryRef eq ${countryId})`
    await updateView.goto(filter)
    await updateView.getCurrentCatalogue().select(fromCatalogueName)
    await updateView.getNewCatalogue().select(toCatalogueName)

    await updateView.getUpdateButton().click()
    const grid = updateView.getGrid()
    await grid.waitForLoadingComplete()
    expect(await grid.getRowCount()).toBe(3)

    for (let i = 0; i < 3; i++) {
      const row = grid.getRow(i)
      const newValueCell = grid.getColumnById(row, 'newValue')
      await newValueCell.dblclick()
      // Wait for the editor to actually appear and be interactable
      const editor = newValueCell.locator('input')
      await expect(editor).toBeVisible()
      await editor.fill(`${(i + 1) * 3}`)
      await page.keyboard.press('Tab')
    }

    await updateView.getSaveButton().click()
    await grid.waitForLoadingComplete()

    const catalogueView = new CatalogueViewPage(page)
    await catalogueView.goto()
    await catalogueView.getFilter().getInput().fill(toCatalogueName)
    await catalogueView.getGrid().waitForLoadingComplete()
    const selectedRow = catalogueView.getGrid().getRowByText(toCatalogueName)
    await catalogueView.getGrid().getAction('sw-icon-search', selectedRow).click()

    const stampView = new StampViewPage(page)
    await stampView.getGrid().waitForLoadingComplete()
    expect(await stampView.getGrid().getRowCount()).toBe(3)
    for (let i = 0; i < 3; i++) {
      const row = stampView.getGrid().getRowByText(`s${i + 1}`)
      await expect(row).toBeVisible()
      const cell = stampView.getGrid().getColumnById(row, 'value')
      await expect(cell).toHaveText(`€${(i + 1) * 3}.00`)
    }
  })

  test('update with unknown flag', async ({ page }) => {
    const updateView = new UpdateCataloguesViewPage(page)
    const filter = `(countryRef eq ${countryId})`
    await updateView.goto(filter)
    await updateView.getCurrentCatalogue().select(fromCatalogueName)
    await updateView.getNewCatalogue().select(toCatalogueName)

    await updateView.getUpdateButton().click()
    const grid = updateView.getGrid()
    await grid.waitForLoadingComplete()
    expect(await grid.getRowCount()).toBe(3)

    // stamp 1: set unknown flag
    const row1 = grid.getRow(0)
    const unknownCell = grid.getColumnById(row1, 'unknown')
    await unknownCell.locator('input[type="checkbox"]').check()
    await page.keyboard.press('Tab')

    // stamp 2: set new value
    const row2 = grid.getRow(1)
    const newValueCell = grid.getColumnById(row2, 'newValue')
    await newValueCell.dblclick()
    // Wait for the editor to actually appear
    const editor = newValueCell.locator('input')
    await expect(editor).toBeVisible()
    await editor.fill(`42`)
    await page.keyboard.press('Tab') // Use Tab here too for consistency and reliability

    await updateView.getSaveButton().click()
    await grid.waitForLoadingComplete()

    // Verification
    const catalogueView = new CatalogueViewPage(page)
    await catalogueView.goto()
    await catalogueView.getFilter().getInput().fill(toCatalogueName)
    await catalogueView.getGrid().waitForLoadingComplete()
    const selectedRow = catalogueView.getGrid().getRowByText(toCatalogueName)
    await catalogueView.getGrid().getAction('sw-icon-search', selectedRow).click()

    const stampView = new StampViewPage(page)
    await stampView.getGrid().waitForLoadingComplete()
    expect(await stampView.getGrid().getRowCount()).toBe(2)

    // Verify stamp 1 (unknown)
    const stamp1Row = stampView.getGrid().getRowByText('s1')
    await expect(stamp1Row).toBeVisible()
    const valueCell1 = stampView.getGrid().getColumnById(stamp1Row, 'value')
    await expect(valueCell1).toHaveText('')

    // Verify stamp 2 (value updated)
    const stamp2Row = stampView.getGrid().getRowByText('s2')
    await expect(stamp2Row).toBeVisible()
    const valueCell2 = stampView.getGrid().getColumnById(stamp2Row, 'value')
    await expect(valueCell2).toHaveText('€42.00')

    // Verify stamp 3 is not there
    const stamp3Row = stampView.getGrid().getRowByText('s3')
    await expect(stamp3Row).not.toBeVisible()
  })
})
