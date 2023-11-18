import { test, expect, Locator } from '@playwright/test'
import { StampCollectionsViewPage } from '../../pages/views/StampCollectionsView-page'
import { generateText } from '../../helpers/test-utils'
import { PromptCmp } from '../../pages/components/Prompt-cmp'

// See here how to get started:
// https://playwright.dev/docs/intro
test('verify management of stamp collections', async ({ page }) => {
  const view = new StampCollectionsViewPage(page)
  await view.goto()
  const createButton = await view.getCreateButton()
  await expect(createButton).toBeVisible()
  await createButton.click()

  const name = 'TestCollection-' + new Date().getTime()
  const revisedName = `a-${name}`

  testCreateForm(view, name)

  await view.getFilter().getInput().fill(name)
  await view.getGrid().waitForLoadingComplete()
  await view.getGrid().waitForLoadingComplete()
  const selectedRow = await view.getGrid().getRowByText(name)
  await view.getGrid().getAction('sw-icon-edit', selectedRow).click()

  testEditForm(view, name, revisedName)

  await view.getFilter().getInput().fill(revisedName)
  await view.getGrid().waitForLoadingComplete()

  const rowItem: Locator = await view.getGrid().getRowByText(revisedName)
  await rowItem.click()
  await expect(view.getDeleteButton()).toBeEnabled()
  await view.getDeleteButton().click()
  const prompt: PromptCmp = new PromptCmp(page)

  expect(await prompt.isVisible()).toBe(true)
  expect(await prompt.getMessage()).toBe(`Delete the collection '${revisedName}'?`)
  await prompt.no()
  await view.getGrid().waitForLoadingComplete()
  await rowItem.click()
  await view.getDeleteButton().click()
  await prompt.yes()
  expect(await prompt.isVisible()).toBe(false)
  await page.reload()
  await view.getGrid().waitForLoadingComplete()
  await view.getFilter().getInput().fill(revisedName)
  await view.getGrid().waitForLoadingComplete()
  expect(await view.getGrid().getRowCount()).toBe(0)
})

const testCreateForm = async (view: StampCollectionsViewPage, name: string) => {
  const editor = await view.getEditor()
  await expect(editor.getTitle()).toHaveText('New Stamp Collection')
  await expect(editor.getSaveButton()).toBeDisabled()
  expect(await editor.isInvalid()).toBe(true)
  await expect(editor.getName()).toHaveClass(/form-color-input-danger/)
  await editor.getName().fill(name)
  await editor.getDescription().fill('some test description')
  await expect(editor.getName()).not.toHaveClass(/form-color-input-danger/)
  expect(await editor.isValid()).toBe(true)
  await editor.getSaveButton().click()
}

const testEditForm = async (
  view: StampCollectionsViewPage,
  name: string,
  revisedName: string
) => {
  const editor = await view.getEditor()
  await expect(editor.getTitle()).toHaveText('Edit Stamp Collection')
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
  await editor.getDescription().clear()
  await editor.getDescription().fill('some description to update')
  await editor.getName().clear()
  await editor.getName().fill(revisedName)
  expect(await editor.isValid()).toBe(true)
  await editor.getSaveButton().click()
}
