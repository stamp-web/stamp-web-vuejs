import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('Visit the app root that contains info items', async ({ page }) => {
  await page.goto('/')
  /**
   * TODO: Fixing a lint error - need to determine if this is still needed
   */
  // await page.waitForTimeout(1500)
  await expect(page.locator('div#app h1')).toHaveText('Stamp Web Editor')
  await expect(page.locator('main')).toBeVisible()
  expect(await page.locator('main').locator('div.info-item').count()).toBe(6)
})
