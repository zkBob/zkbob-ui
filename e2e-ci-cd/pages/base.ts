import { Locator, Page, expect } from '@playwright/test';

import { TIMEOUTS } from './../constants';

export default abstract class BasePage {
  readonly page: Page;
  protected $root: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  public locator(
    selector: string,
    options?: {
      has?: Locator;
      hasText?: string | RegExp;
    },
  ) {
    return this.page.locator(selector, options);
  }

  public async open(path = '/', timeout = TIMEOUTS.fiveMinutes): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async delay(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
  }

  public async reload(): Promise<void> {
    await this.page.evaluate(() => {
      window.location.reload();
    });
  }

  public get expect() {
    return expect(this.page);
  }

  public async focus(): Promise<void> {
    await this.page.bringToFront();
  }

  public async sleep(timeout = TIMEOUTS.medium): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  public async waitForNetworkIdle(timeout = TIMEOUTS.tenMinutes): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /** @deprecated */
  public async waitForEvent(event: 'page', timeout = TIMEOUTS.oneMinute): Promise<Page> {
    return this.page.context().waitForEvent(event, { timeout });
  }

  public async waitForPage(timeout = TIMEOUTS.oneMinute): Promise<Page> {
    return this.page.context().waitForEvent('page', { timeout });
  }

  public async waitForVisible(timeout = TIMEOUTS.oneMinute): Promise<void> {
    return this.$root.waitFor({ state: 'visible', timeout });
  }
}
