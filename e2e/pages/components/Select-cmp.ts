import { Page } from '@playwright/test'
import { encodeId } from '../../helpers/test-utils.js'

export class SelectCmp {
  readonly page: Page
  readonly prop: string
  readonly bodyAttached: boolean
  readonly filterable: boolean

  constructor(page: Page, prop: string, filterable: boolean = true, bodyAttached: boolean = true) {
    this.page = page
    this.prop = prop
    this.filterable = filterable
    this.bodyAttached = bodyAttached
  }

  private getLocator() {
    return this.page.locator(`${this.filterable ? 'input' : 'div'}[id='${encodeId(this.prop)}']`)
  }

  getText(): Promise<string> {
    return this.getLocator().getByRole('combobox').locator('.overflow-ellipsis').innerText()
  }

  async clear() {
    await this.getLocator().getByRole('combobox').getByRole('button').click()
  }
  async select(text: string) {
    await this.getLocator().click()
    // allow drop down to open
    await this.page.waitForTimeout(500)
    let loc
    if (this.bodyAttached) {
      loc = await this.page.locator(`div[id='${encodeId(this.prop)}-dropdown']`)
    } else {
      loc = await this.getLocator().locator(`#${encodeId(this.prop)}-dropdown`)
    }

    await loc.getByRole('option').getByText(text, { exact: true }).click()
  }
}
