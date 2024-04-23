import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('Visit the app root that contains info items', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)
  expect(await page.locator('div#app h1')).toHaveText('Stamp Web Editor')
  expect(await page.locator('main')).toBeVisible()
  expect(await page.locator('main').locator('div.info-item').count()).toBe(6)
})
