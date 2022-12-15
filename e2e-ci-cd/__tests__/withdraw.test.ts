import { test } from '../fixtures/testContextFixture';

test.beforeEach(async ({metamask, zkAccount}) => {
  await zkAccount.open('/')
  await zkAccount.button_zkAccount()
  await zkAccount.button_Agree()
  await zkAccount.RestoreAccount()
  await zkAccount.CreatePassword()
  await zkAccount.CheckAccount()
});

test('Withdraw', async ({OperationsWithToken}) => {
  await OperationsWithToken.Withdraw()
})