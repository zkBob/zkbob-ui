import { browserName } from 'react-device-detect';
import { test } from '../fixtures/testContextFixture';
import BasePage from '../pages/base';

const ZKBOB_ADDRESS_BOB_SEPOLIA = process.env.ZKBOB_ADDRESS_BOB_SEPOLIA as string;
const WEB3_WALLET_ADDRESS = process.env.WEB3_WALLET_ADDRESS as string;

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
    test.only('Deposit BOB', async ({ OperationsWithToken }) => {
        await OperationsWithToken.GoToDepositTab()
        await OperationsWithToken.SelectSepoliaNetwork()
        await OperationsWithToken.SelectBOBSepolia()
        await OperationsWithToken.InputAmount()
        await OperationsWithToken.button_Deposit()
        await OperationsWithToken.TheCheckingTheDepositSent()
    });
  
    test('Transfer BOB', async ({ OperationsWithToken }) => {
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
        await OperationsWithToken.GoToWithdrawTab()
        await OperationsWithToken.SelectSepoliaNetwork()
        await OperationsWithToken.SelectBOBSepolia()
        await OperationsWithToken.InputAmountWithdrawTab()
        await OperationsWithToken.EnterWeb3WalletAddress(WEB3_WALLET_ADDRESS)
        await OperationsWithToken.button_Withdraw()
        await OperationsWithToken.button_Confirm()
        await OperationsWithToken.CheckWithdraw()
    });
});