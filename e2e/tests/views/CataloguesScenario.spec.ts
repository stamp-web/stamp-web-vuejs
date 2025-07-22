import { test, expect, Locator, Page } from '@playwright/test'
import { generateText } from '../../helpers/test-utils.js'
import { PromptCmp } from '../../pages/components/Prompt-cmp.js'
import { CatalogueTestHelper } from '../../helpers/api-helpers.js'
import { CatalogueViewPage } from '../../pages/views/CatalogueView-page.js'
import { CatalogueEditorCmp } from '../../pages/components/CatalogueEditor-cmp.js'
import { Catalogue } from '../../../src/models/Catalogue.js'

test.describe('creation tests', () => {
  let name: string

  test.beforeEach(() => {
    name = 'createCatalogue-' + new Date().getTime()
  })

  test.afterEach(async ({ request }) => {
    await CatalogueTestHelper.deleteByName(request, name)
  })

  test('valid create', async ({ page }) => {
    const view = new CatalogueViewPage(page)
    await view.goto()
    const createButton = view.getCreateButton()
    await createButton.click()
    const editor = view.getEditor()
    await expect(editor.getTitle()).toHaveText('New Catalogue')
    await expect(editor.getSaveButton()).toBeDisabled()
    expect(await editor.isInvalid()).toBe(true)
    await expect(editor.getIssue()).toHaveClass(/form-color-input-danger/)
    await expect(editor.getName()).toHaveClass(/form-color-input-danger/)
    await editor.getIssue().fill('2024')
    await editor.getCatalogueType().select('Michel')
    await editor.getName().fill(name)
    await editor.getCurrency().select('EUR')
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
  let view: CatalogueViewPage
  let name: string

  test.beforeEach(async ({ request }) => {
    name = `deleteCatalogue-${new Date().getTime()}`
    await CatalogueTestHelper.create(request, { name: name, issue: 2015, type: 0, code: 'USD' })
  })

  test('delete verification', async ({ page }) => {
    view = new CatalogueViewPage(page)
    await view.goto()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = await view.getGrid().getRowByText(name)
    // since the find stamps column is in the middle of the row we need to click something more specific
    await selectedRow.locator(`text=${name}`).click()
    await expect(view.getDeleteButton()).toBeEnabled()
    await view.getDeleteButton().click()
    const prompt: PromptCmp = new PromptCmp(page)
    await expect(prompt).toBeVisible()
    expect(await prompt.getMessage()).toBe(`Delete the catalogue '2015 - ${name}'?`)
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
  let view: CatalogueViewPage
  let editor: CatalogueEditorCmp

  let model: Catalogue
  let name: string
  let revisedName: string

  test.beforeEach(async ({ request }) => {
    name = 'editCollection-' + new Date().getTime()
    model = await CatalogueTestHelper.create(request, {
      name,
      issue: 2024,
      type: 1,
      code: 'GBP',
      description: 'some description'
    })
    revisedName = `a-${name}`
  })

  test.afterEach(async ({ request }) => {
    await CatalogueTestHelper.delete(request, model.id)
  })

  async function navigateToEditor(page: Page) {
    view = new CatalogueViewPage(page)
    await view.goto()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = view.getGrid().getRowByText(name)
    await view.getGrid().getAction('sw-icon-edit', selectedRow).click()

    editor = view.getEditor()
    await expect(editor.getTitle()).toHaveText('Edit Catalogue')
  }

  test('edit valid fields', async ({ page }) => {
    await navigateToEditor(page)
    await editor.getIssue().clear()
    await editor.getIssue().fill('2025')
    await editor.getCatalogueType().select('Darnell')
    await editor.getName().clear()
    await editor.getName().fill(revisedName)
    await editor.getCurrency().select('CAD')
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
    await editor.getIssue().clear()
    await editor.getIssue().fill('abcd')
    expect(await editor.isInvalid()).toBe(true)
    await editor.getIssue().clear()
    await editor.getIssue().fill('1999')
    expect(await editor.isValid()).toBe(true)
    await editor.getIssue().clear()
    await editor.getIssue().fill('20432')
    expect(await editor.isInvalid()).toBe(true)
    await editor.getIssue().clear()
    await editor.getIssue().fill('2024')
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
