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

  private async AgreeToTermsOfUse() {
    await this.page.locator('//input[@data-testid="onboarding-terms-checkbox"]').click();
    // const getStartedBtn = this.page.locator(welcomePageElements.confirmButton);
    // await getStartedBtn.click();
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
    await this.page.locator('//button[@data-testid="import-srp-confirm"]').click();
    await this.page
      .locator(firstTimeFlowFormPageElements.passwordInput)
      .type(this.METAMASK_PASSWORD, { delay: 100 });
    await this.page
      .locator(firstTimeFlowFormPageElements.confirmPasswordInput)
      .type(this.METAMASK_PASSWORD, { delay: 100 });
    await this.page.locator(firstTimeFlowFormPageElements.PasswordTermsCheckbox).click();
    await this.page.locator(firstTimeFlowFormPageElements.importButton).click();
  }

  private async confirmAll() {
    await this.page.locator(endOfFlowPageElements.gotItButton).click();
    await this.page.locator(endOfFlowPageElements.extensionNextButton).click();
    await this.page.locator(endOfFlowPageElements.doneButton).click();
    await this.page.locator(endOfFlowPageElements.popoverClose).click();
  }

  async importWallet(): Promise<void> {
    await this.AgreeToTermsOfUse();
    await this.startImportWalletFlow();
    await this.rejectAnalitycs();
    await this.restoreWalletWithSecretWords();
    await this.confirmAll();
    

    await this.page
      .locator(mainPageElements.walletOverview)
      .waitFor({ state: 'visible', timeout: TIMEOUTS.big });
  }


  async showTestNetworks() {
    await this.focus();
    await this.page.locator(mainPageElements.buttonAccountMenu).click();
    await this.page.locator(mainPageElements.buttonSettings).click();
    await this.page.locator(settingsPageElements.advancedButton).click();
    if (await this.page.locator(advancedPageElements.showTestNetworksToggleOff).isVisible()) {
      await this.page.locator(advancedPageElements.showTestNetworksToggleOff).click();
    }
    await this.page.locator(mainPageElements.LOGO).click();
  }
  

  async addGoerliOPNetwork(){
    await this.showTestNetworks();
    await this.page.locator(settingsPageElements.networksButton).click();
    await this.page.locator(mainPageElements.buttonAddNetwork).click();
    await this.page.locator(mainPageElements.buttonAddNetworkManually).click();
    await this.page.locator(advancedPageElements.networkName).type('Optimism Goerli', { delay: 100 });
    await this.page.locator(advancedPageElements.newRPCUrl).type('https://goerli.optimism.io/', { delay: 100 });
    await this.page.locator(advancedPageElements.chainID).type('420', { delay: 100 });
    await this.page.locator(advancedPageElements.currencySymbol).type('ETH', { delay: 100 });
    await this.page.locator(advancedPageElements.save).click();
    // await this.page.locator(mainPageElements.buttonConfirm).click();
    await this.page.locator(mainPageElements.buttonSwitchToNetwork).click();

  }

  async addGoerliNetwork(){
    await this.showTestNetworks();
    await this.page.locator(settingsPageElements.networksButton).click();
    await this.page.locator(mainPageElements.buttonAddNetwork).click();
    await this.page.locator(mainPageElements.buttonAddNetworkManually).click();
    await this.page.locator(advancedPageElements.networkName).type('Goerli');
    await this.page.locator(advancedPageElements.newRPCUrl).type('https://goerli.infura.io/v3/');
    await this.page.locator(advancedPageElements.chainID).type('5');
    await this.page.locator(advancedPageElements.currencySymbol).type('GoerliETH');
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
