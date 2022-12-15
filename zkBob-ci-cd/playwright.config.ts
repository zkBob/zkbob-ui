import dotenv from 'dotenv';

import { PlaywrightTestConfig } from '@playwright/test';

import { TIMEOUTS } from './constants';

const { CI, TEST_ENV } = process.env;

if (!TEST_ENV)
  throw Error('\n\nPlease provide TEST_ENV environment variable, e.x.: "TEST_ENV=local"\n\n');

dotenv.config(CI ? {} : { path: `./.env.${TEST_ENV}` });

if (!process.env.METAMASK_SEED_PHRASE)
  throw Error('\n\nPlease provide METAMASK_SEED_PHRASE environment variable\n\n');

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./globalSetup.ts'),
  timeout: TIMEOUTS.oneMinute * 10,
  globalTimeout: TIMEOUTS.oneMinute * 40,
  reportSlowTests: null,
  use: {
    baseURL: process.env.BASE_URL || 'https://stage.augmented.finance',
    trace: 'on-first-retry',
    video: 'off',
    screenshot: 'on',
    actionTimeout: TIMEOUTS.big,
    navigationTimeout: TIMEOUTS.oneMinute * 3,
  },
  projects: [
    { name: 'all', testDir: './__tests__' },
    {
      name: 'healthCheckProd',
      testDir: './__tests__/healthCheck',
      testMatch: /.*(markets|switchNetwork)\.spec\.ts/,
    },
    { name: 'warmUp', testDir: './__tests__/warmUp' },
  ],
  workers: 1,
  retries: CI ? 1 : 0,
  reporter: CI
    ? [['github'], ['list']]
    : [['list'], ['html', { outputFolder: './test-results/html-report', open: 'on-failure' }]],
};
export default config;
