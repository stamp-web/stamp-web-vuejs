import { test, expect, Locator, Page } from '@playwright/test'
import { CountryViewPage } from '../../pages/views/CountryView-page'
import { generateText } from '../../helpers/test-utils'
import { PromptCmp } from '../../pages/components/Prompt-cmp'
import { CountryTestHelper } from '../../helpers/api-helpers'
import { Country } from '../../../src/models/entityModels'
import { CountryEditorCmp } from '../../pages/components/CountryEditor-cmp'

test.describe('creation tests', () => {
  let name: string

  test.beforeEach(() => {
    name = 'createCountry-' + new Date().getTime()
  })

  test.afterEach(async ({ request }) => {
    await CountryTestHelper.deleteByName(request, name)
  })

  test('valid create', async ({ page }) => {
    const view = new CountryViewPage(page)
    await view.goto()
    const createButton = view.getCreateButton()
    await createButton.click()
    const editor = view.getEditor()
    await expect(editor.getTitle()).toHaveText('New Country')
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

    expect(await selectedRow.isVisible()).toBe(true)
  })
})

test.describe('delete scenarios', () => {
  let view: CountryViewPage
  let name: string

  test.beforeEach(async ({ request }) => {
    name = `deleteCountry-${new Date().getTime()}`
    await CountryTestHelper.create(request, { name })
  })

  test('delete verification', async ({ page }) => {
    view = new CountryViewPage(page)
    await view.goto()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = view.getGrid().getRowByText(name)
    await selectedRow.click()
    await expect(view.getDeleteButton()).toBeEnabled()
    await view.getDeleteButton().click()
    const prompt: PromptCmp = new PromptCmp(page)
    expect(await prompt.isVisible()).toBe(true)
    expect(await prompt.getMessage()).toBe(`Delete the country '${name}'?`)
    await prompt.no()
    await view.getGrid().waitForLoadingComplete()
    await view.getDeleteButton().click()
    await prompt.yes()
    expect(await prompt.isVisible()).toBe(false)
    await page.reload()
    await view.getGrid().waitForLoadingComplete()
    await view.getFilter().getInput().clear()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    expect(await view.getGrid().getRowCount()).toBe(0)
  })
})

test.describe('edit scenarios', () => {
  let view: CountryViewPage
  let editor: CountryEditorCmp

  let model: Country
  let name: string
  let revisedName: string

  test.beforeEach(async ({ request }) => {
    name = 'editCountry-' + new Date().getTime()
    model = await CountryTestHelper.create(request, {
      name,
      description: 'some description'
    })
    revisedName = `a-${name}`
  })

  test.afterEach(async ({ request }) => {
    await CountryTestHelper.delete(request, model.id)
  })

  async function navigateToEditor(page: Page) {
    view = new CountryViewPage(page)
    await view.goto()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = view.getGrid().getRowByText(name)
    await view.getGrid().getAction('sw-icon-edit', selectedRow).click()

    editor = view.getEditor()
    await expect(editor.getTitle()).toHaveText('Edit Country')
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
    expect(await rowItem.isVisible()).toBe(true)
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
