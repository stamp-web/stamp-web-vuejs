import { test, expect, Locator, Page } from '@playwright/test'
import { generateText } from '../../helpers/test-utils.js'
import { PromptCmp } from '../../pages/components/Prompt-cmp.js'
import { SellerTestHelper } from '../../helpers/api-helpers.js'
import { SellerViewPage } from '../../pages/views/SellerView-page.js'
import { SellerEditorCmp } from '../../pages/components/SellerEditor-cmp.js'

import { Seller } from '../../../src/models/entityModels.js'

test.describe('creation tests', () => {
  let name: string

  test.beforeEach(() => {
    name = 'createSeller-' + new Date().getTime()
  })

  test.afterEach(async ({ request }) => {
    await SellerTestHelper.deleteByName(request, name)
  })

  test('valid create', async ({ page }) => {
    const view = new SellerViewPage(page)
    await view.goto()
    const createButton = view.getCreateButton()
    await createButton.click()
    const editor = view.getEditor()
    await expect(editor.getTitle()).toHaveText('New Seller')
    await expect(editor.getSaveButton()).toBeDisabled()
    expect(await editor.isInvalid()).toBe(true)
    await expect(editor.getName()).toHaveClass(/form-color-input-danger/)
    await editor.getName().fill(name)
    await editor.getDescription().fill('some test description')
    await expect(editor.getName()).not.toHaveClass(/form-color-input-danger/)
    expect(await editor.isValid()).toBe(true)
    await editor.getSaveButton().click()

    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = view.getGrid().getRowByText(name)

    await expect(selectedRow).toBeVisible()
  })
})

test.describe('delete scenarios', () => {
  let view: SellerViewPage
  let name: string

  test.beforeEach(async ({ request }) => {
    name = `deleteSeller-${new Date().getTime()}`
    await SellerTestHelper.create(request, { name })
  })

  test('delete verification', async ({ page }) => {
    view = new SellerViewPage(page)
    await view.goto()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = view.getGrid().getRowByText(name)
    await selectedRow.click()
    await expect(view.getDeleteButton()).toBeEnabled()
    await view.getDeleteButton().click()
    const prompt: PromptCmp = new PromptCmp(page)
    await expect(prompt).toBeVisible()
    expect(await prompt.getMessage()).toBe(`Delete the seller '${name}'?`)
    await prompt.no()
    await view.getGrid().waitForLoadingComplete()
    await view.getDeleteButton().click()
    await prompt.yes()
    await expect(prompt).toBeHidden()
    await page.reload()
    await view.getGrid().waitForLoadingComplete()
    await view.getFilter().getInput().clear()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    expect(await view.getGrid().getRowCount()).toBe(0)
  })
})

test.describe('edit scenarios', () => {
  let view: SellerViewPage
  let editor: SellerEditorCmp

  let model: Seller
  let name: string
  let revisedName: string

  test.beforeEach(async ({ request }) => {
    name = 'editSeller-' + new Date().getTime()
    model = await SellerTestHelper.create(request, {
      name,
      description: 'some description'
    })
    revisedName = `a-${name}`
  })

  test.afterEach(async ({ request }) => {
    await SellerTestHelper.delete(request, model.id)
  })

  async function navigateToEditor(page: Page) {
    view = new SellerViewPage(page)
    await view.goto()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = view.getGrid().getRowByText(name)
    await view.getGrid().getAction('sw-icon-edit', selectedRow).click()

    editor = view.getEditor()
    await expect(editor.getTitle()).toHaveText('Edit Seller')
  }

  test('edit valid fields', async ({ page }) => {
    await navigateToEditor(page)
    await editor.getName().clear()
    await editor.getName().fill(revisedName)
    await editor.getDescription().clear()
    await editor.getDescription().fill('some description to update')
    expect(await editor.isValid()).toBe(true)
    await editor.getSaveButton().click()
    await view.getFilter().getInput().clear()
    await view.getFilter().getInput().fill(revisedName)
    await view.getGrid().waitForLoadingComplete()
    const rowItem: Locator = view.getGrid().getRowByText(revisedName)
    await expect(rowItem).toBeVisible()
  })

  test('validation of fields', async ({ page }) => {
    await navigateToEditor(page)
    expect(await editor.isValid()).toBe(true)
    await editor.getName().clear()
    await editor.getName().fill(generateText(150))
    expect(await editor.isValid()).toBe(true)
    await editor.getName().clear()
    await editor.getName().fill(generateText(151))
    expect(await editor.isInvalid()).toBe(true)
    await editor.getName().clear()
    await editor.getName().fill(name)
    expect(await editor.isValid()).toBe(true)
    await editor.getDescription().clear()
    await editor.getDescription().fill(generateText(1501))
    expect(await editor.isInvalid()).toBe(true)
  })
})
