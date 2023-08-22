import { test } from '../fixtures/testContextFixture';

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
        await OperationsWithToken.SelectBOB()
        await OperationsWithToken.DepositInputAmount()
        await OperationsWithToken.button_Deposit()
        await OperationsWithToken.TheCheckingTheDepositSent()
    });
  
    test('Transfer BOB', async ({ OperationsWithToken }) => {
      // ...
    });

    test('Withdraw BOB', async ({ OperationsWithToken }) => {
        // ...
      });
  });