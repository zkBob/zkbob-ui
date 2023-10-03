import { expect, Page } from '@playwright/test';
import { TIMEOUTS } from '../../../constants';
import MetamaskNotification from '../../metamaskNotification';
import { 
  zkAccountElementsLocators,
  zkAccountCreatePasswordLocators} from './zkAccountLocators';

import BasePage from '../../base';

var seed_phrase = new Array();

export default class zkAccountPage extends BasePage{
  readonly ZKACCOUNT_PASSWORD: string;
  readonly ZKACCOUNT_SEED_PHRASE: string;

  constructor(page: Page) {
    super(page);
    this.ZKACCOUNT_PASSWORD = process.env.ZKACCOUNT_PASSWORD as string;
    this.ZKACCOUNT_SEED_PHRASE = process.env.ZKACCOUNT_SEED_PHRASE as string;
  }

    async button_GetStarted(): Promise<void> {
      await this.focus();
      await this.locator(zkAccountElementsLocators.button_GetStarted).click();
    }

    // async button_zkAccount(): Promise<void> {
    //   await this.locator(zkAccountElementsLocators.button_zkAccount).click();
    // }

    async button_CreateNewZkAccount(): Promise<void> {
      await this.locator(zkAccountElementsLocators.button_CreateNewZkAccount).click();
    }
    
    async button_UseWeb3wallet(): Promise<void> {
      await this.locator(zkAccountElementsLocators.button_UseWeb3wallet).click();
    }

    async button_IAlreadyHaveZkAccount(): Promise<void> {
      await this.locator(zkAccountElementsLocators.button_IAlreadyHaveZkAccount).click();
    }

    async button_UseSecretPhrase(): Promise<void> {
      await this.locator(zkAccountElementsLocators.button_UseSecretPhrase).click();
    }

    async button_IUsedSeedPhrase(): Promise<void> {
      await this.locator(zkAccountElementsLocators.button_IUsedSeedPhrase).click();
    }

    async UseMetaMask(): Promise<void> {
      await this.locator(`//div//span[text()="MetaMask"]`).click();
    }

    async button_SignMessage(): Promise<void> {
      await this.sleep();
      const [popup] = await Promise.all([this.waitForPage(), this.locator(zkAccountElementsLocators.button_SignMessage).click()]);
      await popup.locator('//button[text()="Sign"]').click();
  
    }

    // async button_Agree(): Promise<void> {
    //   await this.locator(zkAccountElementsLocators.button_Agree).click();
    // }

    async CreatePasswordForzkAccount(): Promise<void> {
      await this.locator(zkAccountCreatePasswordLocators.input_NewPassword).type(this.ZKACCOUNT_PASSWORD, { delay: 100 });
      await this.locator(zkAccountCreatePasswordLocators.input_RepeatPassword).type(this.ZKACCOUNT_PASSWORD, { delay: 100 });

      await this.locator(zkAccountElementsLocators.button_Verify).click();
    }
    
    async CreateWithSecretRecoveryPhrase(): Promise<void> {
      // await this.locator(zkAccountElementsLocators.button_CreateWithSecretRecoveryPhrase).click();
      
      // Copy seed phrase
      for (let num = 1; num < 13; num++){
        let word = await this.locator(`//div/span[text()="${num}"]/../span[2]`).textContent();
        seed_phrase.push(word);
      }

      await this.locator(zkAccountElementsLocators.button_Continue).click();

      // Input seed phrase
      for (const[word] of seed_phrase.entries()){
        await this.locator(`//div[text()="${seed_phrase[word]}"]`).click();
        
      }

      await this.locator(zkAccountElementsLocators.button_Verify).click();
    }

    async ConnectMetaMaskWallet(): Promise<void> {
      // await this.locator(zkAccountElementsLocators.button_CreateWithWeb3Wallet).click();

      // await this.locator(zkAccountElementsLocators.button_ConnectWallet).click();
      const [popup] = await Promise.all([this.waitForPage(), this.locator(zkAccountElementsLocators.button_MetaMaskWallet).click()]);
      const metamaskNotification = new MetamaskNotification(popup);
      await metamaskNotification.grantAccess();

      await this.locator(`text=0x`).isVisible();
    }

    async GenerateKey(): Promise<void> {
      // await this.button_zkAccount()

      const [popup] = await Promise.all([this.waitForPage(), this.locator(`//div[text()="Signature request"]`)]);
      // await popup.locator('//button[text()="Got it"]').click();
      await popup.locator('//button[text()="Sign"]').click();
      // await popup.locator('//button[text()="Switch network"]').click();
    }

    async button_SetPassword(): Promise<void> {
      await this.locator(zkAccountElementsLocators.button_SetPassword).click();
    }

    async CreatePassword(): Promise<void> {
      await this.locator(zkAccountCreatePasswordLocators.input_NewPassword).type(this.ZKACCOUNT_PASSWORD, { delay: 100 });
      await this.locator(zkAccountCreatePasswordLocators.input_RepeatPassword).type(this.ZKACCOUNT_PASSWORD, { delay: 100 });
      await this.locator(zkAccountElementsLocators.button_Verify).click();
    }
    
    async CheckAccount(): Promise<void> {
      await expect(this.locator('//button[text()="Enter amount"]')).toBeVisible({timeout: TIMEOUTS.oneMinute});

    }

    async RestoreAccount(): Promise<void> {
      await this.locator("//textarea").type(this.ZKACCOUNT_SEED_PHRASE, { delay: 100 });
      await this.locator(zkAccountElementsLocators.button_RestoreAccount).click();
    }
}


