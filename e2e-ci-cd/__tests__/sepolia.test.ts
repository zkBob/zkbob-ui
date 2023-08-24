import { test } from '../fixtures/testContextFixture';
import BasePage from '../pages/base';

const ZKBOB_ADDRESS_BOB_SEPOLIA = process.env.ZKBOB_ADDRESS_BOB_SEPOLIA as string;

test.beforeEach(async ({metamask, zkAccount}) => {
  await metamask.importWallet()
  await zkAccount.open('/')
  await zkAccount.button_GetStarted()
  await zkAccount.button_CreateNewZkAccount()
  await zkAccount.button_UseWeb3wallet()
  await zkAccount.ConnectMetaMaskWallet()
  await zkAccount.button_SignMessage()
  await zkAccount.button_SetPassword()
  await zkAccount.CreatePassword()
  await zkAccount.CheckAccount() 
});


test.describe('BOB pool', () => {
    test('Deposit BOB', async ({ OperationsWithToken }) => {
        await OperationsWithToken.GoToDepositTab()
        await OperationsWithToken.SelectSepoliaNetwork()
        await OperationsWithToken.SelectBOBSepolia()
        await OperationsWithToken.InputAmount()
        await OperationsWithToken.button_Deposit()
        await OperationsWithToken.TheCheckingTheDepositSent()
    });
  
    test.only('Transfer BOB', async ({ OperationsWithToken }) => {
        await OperationsWithToken.GoToTransferTab()
        await OperationsWithToken.SelectSepoliaNetwork()
        await OperationsWithToken.SelectBOBSepolia()
        await OperationsWithToken.InputAmountTransferTab()
        await OperationsWithToken.EnterzkBOBAddress(ZKBOB_ADDRESS_BOB_SEPOLIA)
        await OperationsWithToken.button_Transfer()
        await OperationsWithToken.button_Confirm()
        await OperationsWithToken.CheckTransfer()
    });

    test('Withdraw BOB', async ({ OperationsWithToken }) => {
        // ...
      });
  });