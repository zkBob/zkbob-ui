import { Page } from '@playwright/test';

import { TIMEOUTS } from '../../constants';
import BasePage from '../base';
import {
  endOfFlowPageElements,
  firstTimeFlowFormPageElements,
  firstTimeFlowPageElements,
  metametricsPageElements,
  welcomePageElements,
} from './firstTimeFlowElements';
import { CustomNetworksNames, MetamaskMethods, NetworkParameters } from './interfaces';
import { mainPageElements } from './mainPageElements';
import {
  addNetworkPageElements,
  advancedPageElements,
  networksPageElements,
  settingsPageElements,
  updateNetworkPageElements,
} from './settingsPageElements';

export default class Metamask extends BasePage implements MetamaskMethods {
  readonly METAMASK_SEED_PHRASE: string;
  readonly METAMASK_PASSWORD: string;

  constructor(page: Page) {
    super(page);
    this.METAMASK_SEED_PHRASE = process.env.METAMASK_SEED_PHRASE as string;
    this.METAMASK_PASSWORD = process.env.METAMASK_PASSWORD || '12344321';
  }

  private async confirmWelcomePage() {
    const getStartedBtn = this.page.locator(welcomePageElements.confirmButton);
    await getStartedBtn.click();
  }

  private async startImportWalletFlow() {
    await this.page
      .locator(firstTimeFlowPageElements.importWalletButton)
      .click({ timeout: TIMEOUTS.medium });
  }

  private async rejectAnalitycs() {
    await this.page
      .locator(metametricsPageElements.optOutAnalyticsButton)
      .click({ timeout: TIMEOUTS.medium }); // no thanks
  }

  async clickElementJS(locator: string): Promise<void> {
    await this.page.waitForSelector(locator)
    await this.page.$eval(locator, (element: HTMLElement) => element.click())
}

  private async restoreWalletWithSecretWords() {
    const words = this.METAMASK_SEED_PHRASE.split(" ")
    for (const [i, word] of words.entries()) {
      await this.page.type(`#import-srp__srp-word-${i}`, word, { delay: 100 })
    }
    await this.page
      .locator(firstTimeFlowFormPageElements.passwordInput)
      .type(this.METAMASK_PASSWORD, { delay: 100 });
    await this.page
      .locator(firstTimeFlowFormPageElements.confirmPasswordInput)
      .type(this.METAMASK_PASSWORD, { delay: 100 });
    await this.clickElementJS(firstTimeFlowFormPageElements.newSignupCheckbox);
    await this.clickElementJS(firstTimeFlowFormPageElements.importButton);
  }

  private async confirmAllDone() {
    await this.clickElementJS(endOfFlowPageElements.allDoneButton);
  }

  async importWallet(): Promise<void> {
    await this.confirmWelcomePage();
    await this.rejectAnalitycs();
    await this.startImportWalletFlow();
    await this.restoreWalletWithSecretWords();
    await this.confirmAllDone();
    

    await this.page
      .locator(mainPageElements.walletOverview)
      .waitFor({ state: 'visible', timeout: TIMEOUTS.big });
  }


  async showTestNetworks() {
    await this.focus();
    await this.page.locator(mainPageElements.accountMenu.button).click();
    await this.page.locator(mainPageElements.accountMenu.settingsButton).click();
    await this.page.locator(settingsPageElements.advancedButton).click();
    if (await this.page.locator(advancedPageElements.showTestNetworksToggleOff).isVisible()) {
      await this.page.locator(advancedPageElements.showTestNetworksToggleOff).click();
    }
    await this.page.locator(mainPageElements.LOGO).click();
  }
  

  async addCustomNetworks(){
    await this.showTestNetworks();
    await this.page.locator(settingsPageElements.networksButton).click();
    await this.page.locator(mainPageElements.addCustomNetwork).click();
    await this.page.locator(advancedPageElements.networkName).type('Optimism Goerli');
    await this.page.locator(advancedPageElements.newRPCUrl).type('https://goerli.optimism.io/');
    await this.page.locator(advancedPageElements.chainID).type('11155111');
    await this.page.locator(advancedPageElements.currencySymbol).type('ETH');
    await this.page.locator(advancedPageElements.save).click();
    await this.page.locator(mainPageElements.buttonConfirm).click();

  }

  async updateNetwork(params: NetworkParameters) {
    await this.focus();
    await this.showTestNetworks();
    await this.page.locator(mainPageElements.accountMenu.button).click();
    await this.page.locator(mainPageElements.accountMenu.settingsButton).click();
    await this.page.locator(settingsPageElements.networksButton).click();

    await this.page
      .locator(networksPageElements.networksListItem, { hasText: params.networkName })
      .click();

    await this.page.waitForTimeout(2000);

    await this.page
      .locator(updateNetworkPageElements.networkNameUpdateInput)
      .fill(params.networkName);
    await this.page.locator(updateNetworkPageElements.rpcUrlUpdateInput).fill(params.rpcUrl);
    await this.page.locator(updateNetworkPageElements.chainIdUpdateInput).fill(params.chainId);
    await this.page.locator(updateNetworkPageElements.symbolUpdateInput).fill(params.symbol);
    await this.page
      .locator(updateNetworkPageElements.blockExplorerUpdateInput)
      .fill(params.blockExplorerUrl);
    await this.page.locator(updateNetworkPageElements.saveUpdateButton).click();
    await this.page.locator(mainPageElements.LOGO).click();
  }

  async selectNetwork(network: CustomNetworksNames) {
    await this.focus();
    await this.page.locator(mainPageElements.networkSwitcher.button).click();
    await this.page
      .locator(mainPageElements.networkSwitcher.dropdownMenuItem, { hasText: network })
      .click();
    await this.page.locator(mainPageElements.LOGO).click();
  }

  async disconnectSite(): Promise<void> {
    await this.focus();
    await this.page.locator(mainPageElements.optionsMenu.button).click();
    await this.page.locator(mainPageElements.optionsMenu.connectedSitesButton).click();
    await this.page.locator(mainPageElements.connectedSites.trashButton).click();
    await this.page.locator(mainPageElements.connectedSites.disconnectButton).click();
    await this.page.locator(mainPageElements.connectedSites.modal).waitFor({ state: 'hidden' });
  }
}
