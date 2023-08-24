import { expect, Page } from '@playwright/test';
import { TIMEOUTS } from '../../../constants';
import { OperationsWithTokenElementsLocators} from './OperationsWithTokenLocators';
import BasePage from '../../base';
import { zkAccountCreatePasswordLocators, zkAccountElementsLocators } from '../zkAccount/zkAccountLocators';

export default class OperationsWithTokenPages extends BasePage{
  readonly ADDRESS_METAMASK_ACCOUNT: string;
  readonly ZKACCOUNT_PASSWORD: string;
  readonly ZKBOB_ADDRESS_BOB_SEPOLIA: string;
  readonly ZKACCOUNT_SEED_PHRASE: string;

  constructor(page: Page) {
    super(page);
    this.ADDRESS_METAMASK_ACCOUNT = process.env.ADDRESS_METAMASK_ACCOUNT as string;
    this.ZKACCOUNT_PASSWORD = process.env.ZKACCOUNT_PASSWORD as string;
    this.ZKBOB_ADDRESS_BOB_SEPOLIA = process.env.ZKBOB_ADDRESS_BOB_SEPOLIA as string;
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

    async SelectSepoliaNetwork():Promise<void> {
      await expect(this.locator('//button[text()="Enter amount"]')).toBeVisible({timeout: TIMEOUTS.oneMinute});
      if (await this.locator('//div[3]//div[2]//div//img[contains(@src,"sepolia")]').isVisible()){
        console.log('Sepolia Network has already been selected');
      }

      else{
        await this.locator('//div[@id="root"]/div[3]/div[1]/div[2]/div[1]').click();
        await this.locator('//button//div[text()="Sepolia"]').click();
      }
    }

    async SelectGoerliOPNetwork():Promise<void> {
      await expect(this.locator('//button[text()="Enter amount"]')).toBeVisible({timeout: TIMEOUTS.fiveMinutes});
      if (await (this.locator('//div[3]//div[2]//div//img[contains(@src,"optimism")]')).isVisible()){
        console.log('Goerli OP Network has already been selected');
      }

      else{
        await this.locator('//div[@id="root"]/div[3]/div[1]/div[2]/div[1]').click();
        await this.locator('//button//div[text()="Goerli Optimism"]').click();
      }
    }

    async SelectGoerliNetwork():Promise<void> {
      await expect(this.locator('//button[text()="Enter amount"]')).toBeVisible({timeout: TIMEOUTS.fiveMinutes});
      if (await (this.locator('//div[3]//div[2]//div//img[contains(@src,"goerli")]')).isVisible()){
        console.log('Goerli Network has already been selected');
      }

      else{
        await this.locator('//div[@id="root"]/div[3]/div[1]/div[2]/div[1]').click();
        await this.locator('//button//div[text()="Goerli"]').click();
      }
    }

    async SelectBOBSepolia():Promise<void> {
        await this.locator('//div[@id="root"]/div[3]/div[1]/div[2]/div[1]').click();
        await this.locator('//button[@data-ga-id="pool-bob-sepolia"]').click();
    }

    async SelectBOBOPGoerli():Promise<void> {
      await this.locator('//button[@data-ga-id="pool-bob-op-goerli"]').click();
  }

    async SelectUSDMGoerli():Promise<void> {
      await this.locator('//button[@data-ga-id="pool-bob2usdc-goerli"]').click();
    }

    async SelectUSDCGoerli():Promise<void> {
      await this.locator('//button[@data-ga-id="pool-usdc-goerli"]').click();
    }

    async SelectETHGoerli():Promise<void> {
      await this.locator('//button[@data-ga-id="pool-weth-goerli"]').click();
    }


    async GoToDepositTab():Promise<void> {
      await this.locator(OperationsWithTokenElementsLocators.tab_deposit).click();
      expect(this.page.url()).toContain('/deposit');
    }

    async GoToTransferTab():Promise<void> {
      await this.locator(OperationsWithTokenElementsLocators.tab_transfer).click();
      expect(this.page.url()).toContain('/transfer');
    }

    async GoToWithdrawTab():Promise<void> {
      await this.locator(OperationsWithTokenElementsLocators.tab_withdraw).click();
      expect(this.page.url()).toContain('/withdraw');
    }

    async InputAmount():Promise<void> {
      await this.locator(OperationsWithTokenElementsLocators.input_amount).type('1');
    }

    async InputAmountTransferTab():Promise<void> {
      await this.locator(OperationsWithTokenElementsLocators.input_amount_in_transfer_tab ).type('1');
    }

    async button_Deposit():Promise<void> {
      const [popupSwitchNetwork] = await Promise.all([this.waitForPage(), this.locator(OperationsWithTokenElementsLocators.button_deposit).click()]);
      await popupSwitchNetwork.locator('//button[text()="Switch network"]').click();
      await expect(this.locator('//div/span[text()="Generating a proof"]')).toBeVisible();
      const [popup2] = await Promise.all([this.waitForPage(), await expect(this.locator('//div/span[text()="Please sign a message"]')).toBeVisible()]);
      await popup2.locator('//button[text()="Sign"]').click();
    }

    async button_DepositETH():Promise<void> {
      const [popupSwitchNetwork] = await Promise.all([this.waitForPage(), this.locator(OperationsWithTokenElementsLocators.button_deposit).click()]);
      await popupSwitchNetwork.locator('//button[text()="Switch network"]').click();
      const [popupConfirm] = await Promise.all([this.waitForPage(), this.locator('//div/span[text()="Waiting for transaction"]').isVisible()]);
      await popupConfirm.locator('//button[text()="Confirm"]').click();
    }

    async TheCheckingTheDepositSent():Promise<void> {
      await expect(this.locator('//span[text()="Deposit is in progress"]')).toBeVisible({timeout: TIMEOUTS.oneMinute});
      await this.locator('//button[text()="Got it!"]').click();
      await expect(this.locator('//span[text()="Please wait for your transaction"]')).not.toBeVisible({timeout: TIMEOUTS.oneMinute});
    }

    async EnterzkBOBAddress(ZKBOB_ADDRESS: string):Promise<void> {
      await this.locator(OperationsWithTokenElementsLocators.enter_receiver_address).click();
      await this.locator(OperationsWithTokenElementsLocators.enter_receiver_address).type(ZKBOB_ADDRESS, { delay: 100 });
    }

    async button_Transfer():Promise<void> {
      await this.locator(OperationsWithTokenElementsLocators.button_transfer).click();
    }

    async button_Confirm():Promise<void> {
      await this.locator(OperationsWithTokenElementsLocators.button_confirm).click();
    }

    async CheckTransfer():Promise<void> {
      await expect(this.locator('//span[text()="Transfer is in progress"]')).toBeVisible({timeout: TIMEOUTS.tenMinutes});
    }





























    // async Transfer(): Promise<void> {

    //   await this.locator(OperationsWithTokenElementsLocators.tab_transfer).click();
    //   expect(this.page.url()).toContain('/transfer');
    //   await this.locator(OperationsWithTokenElementsLocators.input_amount_in_transfer_tab).type('1');
    //   await this.locator(OperationsWithTokenElementsLocators.enter_receiver_address).click();
    //   await this.locator(OperationsWithTokenElementsLocators.enter_receiver_address).type(this.ZKBOB_RECEIVER_ADDRESS);
    //   await this.locator(OperationsWithTokenElementsLocators.button_transfer).click();
    //   await this.locator(OperationsWithTokenElementsLocators.button_confirm).click();
    //   await expect(this.locator('//span[text()="Transfer sent"]')).toBeVisible({timeout: TIMEOUTS.tenMinutes});
    //   await expect(this.locator('//span[text()="Please wait for your transaction"]')).not.toBeVisible({timeout: TIMEOUTS.tenMinutes})

    //   }

    // async CheckTransfer(): Promise<void> {
    //   await this.ReloadPage()

    //   // Change account from restore
    //   await expect (this.locator('//div//span[contains(text(), "zk")]')).toBeVisible({timeout:TIMEOUTS.fiveMinutes});
    //   await this.locator('//div//span[contains(text(), "zk")]').click();
    //   await this.locator('//button[text()="Switch account"]').click();
    //   await this.locator(zkAccountElementsLocators.button_RestoreAccount).click();
    //   await this.locator('//span[text()="Input your saved seed phrase to restore an existing account"]//../textarea').type(this.ZKACCOUNT_SEED_PHRASE);
    //   await this.locator(zkAccountElementsLocators.button_RestoreAccount).click();
    //   await this.locator(zkAccountCreatePasswordLocators.input_NewPassword).type(this.ZKACCOUNT_PASSWORD);
    //   await this.locator(zkAccountCreatePasswordLocators.input_RepeatPassword).type(this.ZKACCOUNT_PASSWORD);
    //   await this.locator(zkAccountElementsLocators.button_Verify).click();

    //   // Check last transfer
    //   await this.locator(OperationsWithTokenElementsLocators.tab_history).click();
    //   await expect(this.locator('(//span[text()="History"]//..//div[1]/span/span)[1]')).toHaveText('1', {timeout:TIMEOUTS.oneMinute});

    //   }

    // async Withdraw(): Promise<void> {

    //   await this.locator(OperationsWithTokenElementsLocators.tab_withdraw).click();
    //   expect(this.page.url()).toContain('/withdraw');
    //   await this.locator(OperationsWithTokenElementsLocators.input_amount_in_withdraw_tab).type('1');
    //   await this.locator(OperationsWithTokenElementsLocators.enter_web3_address).type(this.ADDRESS_METAMASK_ACCOUNT);
    //   await this.locator(OperationsWithTokenElementsLocators.button_withdraw).click({timeout:TIMEOUTS.tenMinutes});
    //   await this.locator(OperationsWithTokenElementsLocators.button_confirm).click();
    //   await expect(this.locator('//span[text()="Withdrawal sent"]')).toBeVisible({timeout: TIMEOUTS.tenMinutes});
      
    // }
    

    
}