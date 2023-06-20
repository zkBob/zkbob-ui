import { TIMEOUTS } from '../constants';
import { test } from '../fixtures/testContextFixture';

// test.describe.configure({mode: `parallel`})


test('Create zkAccount with MetaMask', async ({zkAccount, metamask}) => {
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

test('Create zkAccount from seed phrase', async ({zkAccount}) => {
  await zkAccount.open('/')
  await zkAccount.button_GetStarted()
  await zkAccount.button_CreateNewZkAccount()
  await zkAccount.button_UseSecretPhrase()
  await zkAccount.CreateWithSecretRecoveryPhrase()
  await zkAccount.button_SetPassword()
  await zkAccount.CreatePassword()
  await zkAccount.CheckAccount()
});

test('Restore zkAccount from seed phrase', async ({zkAccount}) => {
  await zkAccount.open('/')
  await zkAccount.button_GetStarted()
  await zkAccount.button_IAlreadyHaveZkAccount()
  await zkAccount.button_IUsedSeedPhrase()
  await zkAccount.RestoreAccount()
  await zkAccount.button_SetPassword()
  await zkAccount.CreatePassword()
  await zkAccount.CheckAccount()

});
