const APP = '#app-content .app';
const WELCOME_PAGE = '.welcome-page';
const confirmButton = `${WELCOME_PAGE} .first-time-flow__button`;
export const welcomePageElements = {
  APP,
  WELCOME_PAGE,
  confirmButton,
};

const FIRST_TIME_FLOW_PAGE = '.first-time-flow';
const importWalletButton = `${FIRST_TIME_FLOW_PAGE} .select-action__select-button:nth-child(1) .first-time-flow__button`;
const createWalletButton = `${FIRST_TIME_FLOW_PAGE} .select-action__select-button:nth-child(2) .first-time-flow__button`;
export const firstTimeFlowPageElements = {
  FIRST_TIME_FLOW_PAGE,
  importWalletButton,
  createWalletButton,
};

const METAMETRICS_PAGE = '.metametrics-opt-in';
const optOutAnalyticsButton = `${METAMETRICS_PAGE} [data-testid="page-container-footer-cancel"]`;
export const metametricsPageElements = {
  METAMETRICS_PAGE,
  optOutAnalyticsButton,
};

const FIRST_TIME_FLOW_FORM_PAGE = '.first-time-flow__form';
const secretWordsInput = `${FIRST_TIME_FLOW_FORM_PAGE} .first-time-flow__seedphrase input`;
const passwordInput = `#password`;
const confirmPasswordInput = `#confirm-password`;
const termsCheckbox = `${FIRST_TIME_FLOW_FORM_PAGE} .first-time-flow__terms`;
const importButton = `text=Import >> nth=1`;
const newPasswordInput = `${FIRST_TIME_FLOW_FORM_PAGE} #create-password`;
const newSignupCheckbox = `#create-new-vault__terms-checkbox`;

export const firstTimeFlowFormPageElements = {
  FIRST_TIME_FLOW_FORM_PAGE,
  secretWordsInput,
  passwordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
  newPasswordInput,
  newSignupCheckbox,
};

const SECURE_YOUR_WALLET_PAGE = '.seed-phrase-intro';
const nextButton = `${SECURE_YOUR_WALLET_PAGE} button`;
export const secureYourWalletPageElements = {
  SECURE_YOUR_WALLET_PAGE,
  nextButton,
};

const END_OF_FLOW_PAGE = '.end-of-flow';
const allDoneButton = `${END_OF_FLOW_PAGE} .first-time-flow__button`;
export const endOfFlowPageElements = {
  END_OF_FLOW_PAGE,
  allDoneButton,
};

const REVEAL_SEED_PAGE = '.reveal-seed-phrase';
const remindLaterButton = `${REVEAL_SEED_PAGE} .first-time-flow__button`;
export const revealSeedPageElements = {
  REVEAL_SEED_PAGE,
  remindLaterButton,
};
