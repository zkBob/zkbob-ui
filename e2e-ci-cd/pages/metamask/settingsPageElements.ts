const SETTINGS_PAGE = '.settings-page';
const advancedButton = `//div[text()="Advanced"]`;
const networksButton = `//div[contains(@class, "network-display")][@role="button"]`;
const closeButton = `${SETTINGS_PAGE} .settings-page__close-button`;
export const settingsPageElements = {
  SETTINGS_PAGE,
  advancedButton,
  networksButton,
  closeButton,
};

const customNonceToggleOn =
  '[data-testid="advanced-setting-custom-nonce"] .toggle-button--on input';
const customNonceToggleOff =
  '[data-testid="advanced-setting-custom-nonce"] .toggle-button--off input';
const showTestNetworksToggleOn =
  '(//div[@data-testid="advanced-setting-show-testnet-conversion"])[2]//input[@value="true"]/..';
const showTestNetworksToggleOff =
  '(//div[@data-testid="advanced-setting-show-testnet-conversion"])[2]//input[@value="false"]/..';
const resetAccountButton = '[data-testid="advanced-setting-reset-account"] button';

const networkName = `//h6[text()="Network name"]/ancestor::label/input[@class="form-field__input"]`;
const newRPCUrl = `//h6[text()="New RPC URL"]/ancestor::label/input[@class="form-field__input"]`;
const chainID = `//h6[text()="Chain ID"]/ancestor::label/input[@class="form-field__input"]`;
const currencySymbol = `//h6[text()="Currency symbol"]/ancestor::label/input[@class="form-field__input"]`;
const explorerURL = `//h6[text()="Block explorer URL"]/ancestor::label/input[@class="form-field__input"]`;
const save = `//button[text()="Save"]`
export const advancedPageElements = {
  customNonceToggleOn,
  customNonceToggleOff,
  showTestNetworksToggleOn,
  showTestNetworksToggleOff,
  resetAccountButton,
  networkName,
  newRPCUrl,
  chainID,
  currencySymbol,
  explorerURL,
  save,
};

const nevermindButton = '.modal-container button:nth-child(1)';
const resetButton = '.modal-container button:nth-child(2)';
export const resetAccountModalElements = {
  nevermindButton,
  resetButton,
};

const addNetworkButton = '.networks-tab__body button';
const networksListItem = '.networks-tab__networks-list-item';
export const networksPageElements = { addNetworkButton, networksListItem };

const ADD_NETWORK_FORM = 'div.networks-tab__add-network-form';
const networkNameInput = `${ADD_NETWORK_FORM} .form-field:nth-child(1) input`;
const rpcUrlInput = `${ADD_NETWORK_FORM} .form-field:nth-child(2) input`;
const chainIdInput = `${ADD_NETWORK_FORM} .form-field:nth-child(3) input`;
const symbolInput = `${ADD_NETWORK_FORM} .form-field:nth-child(4) input`;
const blockExplorerInput = `${ADD_NETWORK_FORM} .form-field:nth-child(5) input`;
const saveButton = `${ADD_NETWORK_FORM} button.btn-primary`;
export const addNetworkPageElements = {
  networkNameInput,
  rpcUrlInput,
  chainIdInput,
  symbolInput,
  blockExplorerInput,
  saveButton,
};

const UPDATE_NETWORK_FORM = '.networks-tab__content';
const networkNameUpdateInput = `${UPDATE_NETWORK_FORM} .form-field:nth-child(1) input`;
const rpcUrlUpdateInput = `${UPDATE_NETWORK_FORM} .form-field:nth-child(2) input`;
const chainIdUpdateInput = `${UPDATE_NETWORK_FORM} .form-field:nth-child(3) input`;
const symbolUpdateInput = `${UPDATE_NETWORK_FORM} .form-field:nth-child(4) input`;
const blockExplorerUpdateInput = `${UPDATE_NETWORK_FORM} .form-field:nth-child(5) input`;
const saveUpdateButton = `${UPDATE_NETWORK_FORM} button.btn-primary`;
export const updateNetworkPageElements = {
  networkNameUpdateInput,
  rpcUrlUpdateInput,
  chainIdUpdateInput,
  symbolUpdateInput,
  blockExplorerUpdateInput,
  saveUpdateButton,
};
