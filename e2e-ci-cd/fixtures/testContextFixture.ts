import path from 'path';
import { BrowserContext, chromium, test as base } from '@playwright/test';

import App from '../pages/app';
import zkAccountPage from '../pages/PageObjects/zkAccount/zkAccountElements';

import Metamask from '../pages/metamask';
import OperationsWithTokenPages from '../pages/PageObjects/OperationsWithToken/OperationsWithTokenElements';

interface TestContextFixture {
  metamask: Metamask;
  metamaskContext: BrowserContext;
  app: App;
  zkAccount: zkAccountPage;
  OperationsWithToken: OperationsWithTokenPages;
}

export const test = base.extend<TestContextFixture>({
  metamaskContext: [
    async ({}, use) => {
      const pathToExtension = path.join(__dirname, '../dist/metamask_11.1.1/');
      const userDataDir = path.join(
        __dirname,
        `../tmp/${+new Date()}${Math.random()}`,
      );

      const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        viewport: { width: 1280, height: 1280 },
        args: [
          `--disable-extensions-except=${pathToExtension}`,
          `--load-extension=${pathToExtension}`,
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
        ],
        locale: 'en-US',
      });
      await use(context);
      await context.close()
    },
    { scope: 'test', auto: true },
  ],
  metamask: [
    ({ metamaskContext: context }, use) => {
      context.on('page', async (page) => {
        await page.waitForLoadState();
        if ((await page.title()) === 'MetaMask') {
          await page.reload();
          await page.waitForLoadState();
          await use(new Metamask(page));
        }
      });
    },
    { scope: 'test' },
  ],

  app: async ({ metamaskContext: context }, use) => {
    await use(new App(context.pages()[0]));
    await context.close();
  },

  zkAccount: async ({ metamaskContext: context }, use) => {
    await use(new zkAccountPage(context.pages()[0]));
    await context.close();
  },

  OperationsWithToken: async ({ metamaskContext: context }, use) => {
    await use(new OperationsWithTokenPages(context.pages()[0]));
    await context.close();
  },


});
