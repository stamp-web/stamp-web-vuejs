import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import { loadEnv } from 'vite'
import process from 'node:process'

/* load any variables from .env.e2e to add to process environment */
process.env = { ...process.env, ...loadEnv('e2e', process.cwd()) }
/* default the test port in case it is not defined in environment */
const PORT = process.env.VITE_E2ETEST_PORT || 5173
const BASEURL = process.env.VITE_E2ETEST_BASEURL || `https://localhost:${PORT}`

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 7500
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 5, // undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `${BASEURL}`,
    /* Ignore HTTPS Certificate errors */
    ignoreHTTPSErrors: true,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Only on CI systems run the tests headless */
    headless: true // !!process.env.CI
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    }
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer: {
    /**
     * Use the dev server by default for faster feedback loop.
     * Use the preview server on CI for more realistic testing.
    Playwright will re-use the local server if there is already a dev-server running.
     */
    command: process.env.CI ? `vite preview --port ${PORT}` : `vite dev --port ${PORT}`,
    reuseExistingServer: !process.env.CI
  }
}

export default config

/* Test against mobile viewports. */
// {
//   name: 'Mobile Chrome',
//   use: {
//     ...devices['Pixel 5'],
//   },
// },
// {
//   name: 'Mobile Safari',
//   use: {
//     ...devices['iPhone 12'],
//   },
// },
/*,
{
  name: 'firefox',
      use: {
...devices['Desktop Firefox']
}
}*/

/* Test against branded browsers. */
// {
//   name: 'Microsoft Edge',
//   use: {
//     channel: 'msedge',
//   },
// },
// {
//   name: 'Google Chrome',
//   use: {
//     channel: 'chrome',
//   },
// },
/*
{
  name: 'Mobile Chrome',
      use: {
...devices['Pixel 5']
}
},
{
  name: 'webkit',
      use: {
...devices['Desktop Safari']
}
}*/
