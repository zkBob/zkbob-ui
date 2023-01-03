import { test } from '../fixtures/testContextFixture';

test.beforeEach(async ({metamask, zkAccount}) => {
  await metamask.importWallet()
  await zkAccount.open('/')
  await zkAccount.button_zkAccount()
  await zkAccount.button_Agree()
  await zkAccount.ConnectMetaMaskWallet()
  await zkAccount.GenerateKey()
  await zkAccount.CreatePassword()
  await zkAccount.CheckAccount()
});

test('Transfer', async({OperationsWithToken}) => {
  await OperationsWithToken.Transfer()
  await OperationsWithToken.CheckTransfer()
})
