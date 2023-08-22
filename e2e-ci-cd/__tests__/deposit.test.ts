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



test('Deposit BOB on Sepolia', async({OperationsWithToken}) => {
  await OperationsWithToken.Deposit()
})