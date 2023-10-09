const APP = '#app-content .app';
const WELCOME_PAGE = '.welcome-page';
const confirmButton = `${WELCOME_PAGE} .first-time-flow__button`;
export const welcomePageElements = {
  APP,
  WELCOME_PAGE,
  confirmButton,
};

const FIRST_TIME_FLOW_PAGE = '.first-time-flow';
const importWalletButton = '//button[@data-testid="onboarding-import-wallet"]';
const createWalletButton = `${FIRST_TIME_FLOW_PAGE} .select-action__select-button:nth-child(2) .first-time-flow__button`;
export const firstTimeFlowPageElements = {
  FIRST_TIME_FLOW_PAGE,
  importWalletButton,
  createWalletButton,
};

const METAMETRICS_PAGE = '.metametrics-opt-in';
const optOutAnalyticsButton = '//button[@data-testid="metametrics-no-thanks"]';
export const metametricsPageElements = {
  METAMETRICS_PAGE,
  optOutAnalyticsButton,
};

const FIRST_TIME_FLOW_FORM_PAGE = '.first-time-flow__form';
const secretWordsInput = `${FIRST_TIME_FLOW_FORM_PAGE} .first-time-flow__seedphrase input`;
const passwordInput = '//input[@data-testid="create-password-new"]';
const confirmPasswordInput = '//input[@data-testid="create-password-confirm"]';
const termsCheckbox = `${FIRST_TIME_FLOW_FORM_PAGE} .first-time-flow__terms`;
const importButton = '//button[@data-testid="create-password-import"]';
const newPasswordInput = `${FIRST_TIME_FLOW_FORM_PAGE} #create-password`;
const PasswordTermsCheckbox = '//input[@data-testid="create-password-terms"]';

export const firstTimeFlowFormPageElements = {
  FIRST_TIME_FLOW_FORM_PAGE,
  secretWordsInput,
  passwordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
  newPasswordInput,
  PasswordTermsCheckbox,
};

const SECURE_YOUR_WALLET_PAGE = '.seed-phrase-intro';
const nextButton = `${SECURE_YOUR_WALLET_PAGE} button`;
export const secureYourWalletPageElements = {
  SECURE_YOUR_WALLET_PAGE,
  nextButton,
};

const END_OF_FLOW_PAGE = '.end-of-flow';
const gotItButton = '//button[@data-testid="onboarding-complete-done"]';
const extensionNextButton = '//button[@data-testid="pin-extension-next"]';
const doneButton = '//button[@data-testid="pin-extension-done"]';
const popoverClose = '//button[@data-testid="popover-close"]';
export const endOfFlowPageElements = {
  END_OF_FLOW_PAGE,
  gotItButton,
  extensionNextButton,
  doneButton,
  popoverClose,
};

const REVEAL_SEED_PAGE = '.reveal-seed-phrase';
const remindLaterButton = `${REVEAL_SEED_PAGE} .first-time-flow__button`;
export const revealSeedPageElements = {
  REVEAL_SEED_PAGE,
  remindLaterButton,
};
