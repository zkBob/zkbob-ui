const LOGO = '.app-header__logo-container';

const networkSwitcher = {
  button: '.network-display',
  networkName: '.typography',
  dropdownMenuItem: '.dropdown-menu-item',
  networkButton: (number) => `.dropdown-menu-item:nth-child(${3 + number})`,
};

const walletOverview = '.wallet-overview';
const popup = {
  container: '.popover-container',
  closeButton: '.popover-header__button',
};

const accountMenu = {
  button: '.account-menu__icon',
  accountButton: (number) => `.account-menu__account:nth-child(${number})`,
  accountName: '.account-menu__name',
  createAccountButton: '.account-menu__item--clickable:nth-child(6)',
  importAccountButton: '.account-menu__item--clickable:nth-child(7)',
  settingsButton: '.account-menu__item--clickable:nth-child(11)',
};

const optionsMenu = {
  button: '[data-testid=account-options-menu-button]',
  accountDetailsButton: '[data-testid="account-options-menu__account-details"]',
  connectedSitesButton: '[data-testid="account-options-menu__connected-sites"]',
};

const CONNECTED_SITES_SELECTOR = '.connected-sites';
const connectedSites = {
  modal: CONNECTED_SITES_SELECTOR,
  trashButton: `${CONNECTED_SITES_SELECTOR} .connected-sites-list__trash`,
  cancelButton: `${CONNECTED_SITES_SELECTOR} .btn-secondary`,
  disconnectButton: `${CONNECTED_SITES_SELECTOR} .btn-primary`,
  closeButton: `${CONNECTED_SITES_SELECTOR} [data-testid="popover-close"]`,
};

const accountModal = {
  walletAddressInput: '.account-modal input',
  closeButton: '.account-modal__close',
};

const IMPORT_ACCOUNT_SELECTOR = '.new-account';
const importAccount = {
  page: IMPORT_ACCOUNT_SELECTOR,
  input: `${IMPORT_ACCOUNT_SELECTOR} #private-key-box`,
  cancelButton: `${IMPORT_ACCOUNT_SELECTOR} .btn-default`,
  importButton: `${IMPORT_ACCOUNT_SELECTOR} .btn-secondary`,
};

const createAccount = {
  page: IMPORT_ACCOUNT_SELECTOR,
  input: `${IMPORT_ACCOUNT_SELECTOR} .new-account-create-form__input`,
  cancelButton: `${IMPORT_ACCOUNT_SELECTOR} .btn-default`,
  createButton: `${IMPORT_ACCOUNT_SELECTOR} .btn-secondary`,
};

const addCustomNetwork = `//button[text()="Add network"]`;
const buttonConfirm = `//button[text()="Got it"]`;

export const mainPageElements = {
  LOGO,
  networkSwitcher,
  walletOverview,
  popup,
  accountMenu,
  optionsMenu,
  connectedSites,
  accountModal,
  importAccount,
  createAccount,
  addCustomNetwork,
  buttonConfirm,
};
