import { expect, Page } from '@playwright/test';
import { TIMEOUTS } from '../../../constants';
import { OperationsWithTokenElementsLocators} from './OperationsWithTokenLocators';
import BasePage from '../../base';
import { zkAccountCreatePasswordLocators, zkAccountElementsLocators } from '../zkAccount/zkAccountLocators';

export default class OperationsWithTokenPages extends BasePage{
  readonly ADDRESS_METAMASK_ACCOUNT: string;
  readonly ZKACCOUNT_PASSWORD: string;
  readonly ZKBOB_RECEIVER_ADDRESS: string;
  readonly ZKACCOUNT_SEED_PHRASE: string;

  constructor(page: Page) {
    super(page);
    this.ADDRESS_METAMASK_ACCOUNT = process.env.ADDRESS_METAMASK_ACCOUNT as string;
    this.ZKACCOUNT_PASSWORD = process.env.ZKACCOUNT_PASSWORD as string;
    this.ZKBOB_RECEIVER_ADDRESS = process.env.ZKBOB_RECEIVER_ADDRESS as string;
    this.ZKACCOUNT_SEED_PHRASE = process.env.ZKACCOUNT_SEED_PHRASE as string;
  }

    async ReloadPage(): Promise<void> {
      await this.focus();
      await this.page.reload();
      await this.focus();
      await this.locator(OperationsWithTokenElementsLocators.input_password).type(this.ZKACCOUNT_PASSWORD);
      await this.locator(OperationsWithTokenElementsLocators.button_sign_in).click();
      await expect(this.locator('//div//span[contains(text(), "zk")]')).toBeVisible({timeout: TIMEOUTS.tenMinutes});
    }

    async Deposit(): Promise<void> {
      await this.focus();
      await this.locator(OperationsWithTokenElementsLocators.input_amount).type('1');
      const [popup] = await Promise.all([this.waitForPage(), this.locator(OperationsWithTokenElementsLocators.button_deposit).click()]);
      await popup.locator('//button[text()="Sign"]').click();
      await expect(this.locator('//span[text()="Deposit sent"]')).toBeVisible({timeout: TIMEOUTS.oneMinute});
      await this.locator('//button[text()="Got it!"]').click();
      await expect(this.locator('//span[text()="Please wait for your transaction"]')).not.toBeVisible({timeout: TIMEOUTS.oneMinute});
    }

    async Transfer(): Promise<void> {

      await this.locator(OperationsWithTokenElementsLocators.tab_transfer).click();
      expect(this.page.url()).toContain('/transfer');
      await this.locator(OperationsWithTokenElementsLocators.input_amount).type('1');
      await this.locator(OperationsWithTokenElementsLocators.enter_receiver_address).click();
      await this.locator(OperationsWithTokenElementsLocators.enter_receiver_address).type(this.ZKBOB_RECEIVER_ADDRESS);
      await this.locator(OperationsWithTokenElementsLocators.button_transfer).click();
      await this.locator(OperationsWithTokenElementsLocators.button_confirm).click();
      await expect(this.locator('//span[text()="Transfer sent"]')).toBeVisible({timeout: TIMEOUTS.tenMinutes});
      await expect(this.locator('//span[text()="Please wait for your transaction"]')).not.toBeVisible({timeout: TIMEOUTS.tenMinutes})

      }

    async CheckTransfer(): Promise<void> {
      await this.ReloadPage()

      // Change account from restore
      await expect (this.locator('//div//span[contains(text(), "zk")]')).toBeVisible({timeout:TIMEOUTS.fiveMinutes});
      await this.locator('//div//span[contains(text(), "zk")]').click();
      await this.locator('//div/span[text()="Account"]//../div[2]//button[text()="Switch"]').click();
      await this.locator(zkAccountElementsLocators.button_RestoreAccount).click();
      await this.locator('//span[text()="Input your saved seed phrase to restore an existing account"]//../textarea').type(this.ZKACCOUNT_SEED_PHRASE);
      await this.locator(zkAccountElementsLocators.button_RestoreAccount).click();
      await this.locator(zkAccountCreatePasswordLocators.input_NewPassword).type(this.ZKACCOUNT_PASSWORD);
      await this.locator(zkAccountCreatePasswordLocators.input_RepeatPassword).type(this.ZKACCOUNT_PASSWORD);
      await this.locator(zkAccountElementsLocators.button_Verify).click();

      // Check last transfer
      await this.locator(OperationsWithTokenElementsLocators.tab_history).click();
      await expect(this.locator('(//span[text()="History"]//..//div[1]/span/span)[1]')).toHaveText('1', {timeout:TIMEOUTS.oneMinute});

      }

    async Withdraw(): Promise<void> {

      await this.locator(OperationsWithTokenElementsLocators.tab_withdraw).click();
      expect(this.page.url()).toContain('/withdraw');
      await this.locator(OperationsWithTokenElementsLocators.input_amount).type('1');
      await this.locator(OperationsWithTokenElementsLocators.enter_web3_address).type(this.ADDRESS_METAMASK_ACCOUNT);
      await this.locator(OperationsWithTokenElementsLocators.button_withdraw).click({timeout:TIMEOUTS.tenMinutes});
      await this.locator(OperationsWithTokenElementsLocators.button_confirm).click();
      await expect(this.locator('//span[text()="Withdrawal sent"]')).toBeVisible({timeout: TIMEOUTS.tenMinutes});
      
    }
    

    
}