import { test, expect, Locator, Page } from '@playwright/test'
import { AlbumViewPage } from '../../pages/views/AlbumView-page.js'
import { generateText } from '../../helpers/test-utils.js'
import { PromptCmp } from '../../pages/components/Prompt-cmp.js'
import { AlbumTestHelper, StampCollectionTestHelper } from '../../helpers/api-helpers.js'
import { AlbumEditorCmp } from '../../pages/components/AlbumEditor-cmp.js'

import type { StampCollection } from '../../../src/models/entityModels.js'

test.describe('creation tests', () => {
  let name: string
  let collectionName: string

  test.beforeEach(async ({ request }) => {
    name = 'createAlbum-' + new Date().getTime()
    collectionName = `collectionAlbum-` + new Date().getTime()
    StampCollectionTestHelper.create(request, { name: collectionName })
  })

  test.afterEach(async ({ request }) => {
    await AlbumTestHelper.deleteByName(request, name)
    await StampCollectionTestHelper.deleteByName(request, collectionName)
  })

  test('valid create', async ({ page }) => {
    const view = new AlbumViewPage(page)
    await view.goto()
    const createButton = view.getCreateButton()
    await createButton.click()
    const editor = view.getEditor()
    await expect(editor.getTitle()).toHaveText('New Album')
    await expect(editor.getSaveButton()).toBeDisabled()
    expect(await editor.isInvalid()).toBe(true)
    await expect(editor.getName()).toHaveClass(/form-color-input-danger/)
    await editor.getCollection().select(collectionName)
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
  let view: AlbumViewPage
  let name: string
  let collectionName: string
  // @ts-ignore
  let collection

  test.beforeEach(async ({ request }) => {
    name = `deleteAlbum-${new Date().getTime()}`
    collectionName = `collectionDelete-${new Date().getTime()}`
    collection = await StampCollectionTestHelper.create(request, { name: collectionName })
    await AlbumTestHelper.create(request, {
      name,
      stampCollectionRef: collection.id
    })
  })

  test.afterEach(async ({ request }) => {
    // @ts-ignore
    await StampCollectionTestHelper.delete(request, collection.id)
  })

  test('delete verification', async ({ page }) => {
    view = new AlbumViewPage(page)
    await view.goto()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = view.getGrid().getRowByText(name)
    await selectedRow.click()
    await expect(view.getDeleteButton()).toBeEnabled()
    await view.getDeleteButton().click()
    const prompt: PromptCmp = new PromptCmp(page)
    await expect(prompt.getLocator()).toBeVisible({ timeout: 500 })
    expect(await prompt.getMessage()).toBe(`Delete the album '${name}'?`)
    await prompt.no()
    await view.getGrid().waitForLoadingComplete()
    await view.getDeleteButton().click()
    await prompt.yes()
    await expect(prompt.getLocator()).toBeHidden()
    await expect(prompt.getLocator()).toBeHidden()
    await page.reload()
    await view.getGrid().waitForLoadingComplete()
    await view.getFilter().getInput().clear()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    expect(await view.getGrid().getRowCount()).toBe(0)
  })
})

test.describe('edit scenarios', () => {
  let view: AlbumViewPage
  let editor: AlbumEditorCmp

  let collection: StampCollection
  let name: string
  let revisedName: string

  test.beforeEach(async ({ request }) => {
    name = 'editAlbum-' + new Date().getTime()
    const collectionName = 'albumCollection-' + new Date().getTime()
    collection = await StampCollectionTestHelper.create(request, { name: collectionName })
    await AlbumTestHelper.create(request, {
      name,
      stampCollectionRef: collection.id
    })
    revisedName = `a-${name}`
  })

  test.afterEach(async ({ request }) => {
    await StampCollectionTestHelper.delete(request, collection.id)
  })

  async function navigateToEditor(page: Page) {
    view = new AlbumViewPage(page)
    await view.goto()
    await view.getFilter().getInput().fill(name)
    await view.getGrid().waitForLoadingComplete()
    const selectedRow = view.getGrid().getRowByText(name)
    await view.getGrid().getAction('sw-icon-edit', selectedRow).click()

    editor = view.getEditor()
    await expect(editor.getTitle()).toHaveText('Edit Album')
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
