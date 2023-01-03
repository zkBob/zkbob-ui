import { test } from '../fixtures/testContextFixture';

test.describe.configure({mode: `parallel`})


test('Create zkAccount with MetaMask', async ({zkAccount, metamask}) => {
  await metamask.importWallet()
  await zkAccount.open('/')
  await zkAccount.button_zkAccount()
  await zkAccount.button_Agree()
  await zkAccount.ConnectMetaMaskWallet()
  await zkAccount.GenerateKey()
  await zkAccount.CreatePassword()
  await zkAccount.CheckAccount() 
});

test('Create zkAccount from seed phrase', async ({zkAccount}) => {
  await zkAccount.open('/')
  await zkAccount.button_zkAccount()
  await zkAccount.button_Agree()
  await zkAccount.CreateWithSecretRecoveryPhrase() 
  await zkAccount.CheckAccount()
});

test('Restore zkAccount', async ({zkAccount}) => {
  await zkAccount.open('/')
  await zkAccount.button_zkAccount()
  await zkAccount.button_Agree()
  await zkAccount.RestoreAccount()
  await zkAccount.CreatePassword()
  await zkAccount.CheckAccount()

});
