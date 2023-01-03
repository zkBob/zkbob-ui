import { expect, Page } from '@playwright/test';
import { TIMEOUTS } from '../constants';


import BasePage from './base';
import MetamaskNotification from './metamaskNotification';

export default class App extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async connectMetamask(): Promise<void> {
    await this.focus();

    await this.locator('text=Connect wallet').click();
    await this.locator(`text=Agree`).click();

    const [popup] = await Promise.all([this.waitForPage(), this.locator(`text=MetaMask`).click()]);

    const metamaskNotification = new MetamaskNotification(popup);
    await metamaskNotification.grantAccess();

    await this.locator(`text=0x`).isVisible()
  }
}
