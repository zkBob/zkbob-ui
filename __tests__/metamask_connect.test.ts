import { test } from '../e2e-ci-cd/fixtures/testContextFixture';

test('Import wallet', async ({app, metamask}) => {
  await metamask.importWallet()
  await app.open('/')
  await app.connectMetamask()
});
