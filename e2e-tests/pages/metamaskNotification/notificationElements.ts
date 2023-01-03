const notificationPage = '.notification';
const nextButton = `text=Next`;
const connectButton = `//button[text()="Connect"]`;
const approveChangeNetwork = `text=Approve`;
const allowToSwitchNetwork = `text=Switch network`;
const allowToSpendButton = `${notificationPage} [data-testid="page-container-footer-next"]`;
const rejectToSpendButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`;
export const notificationPageElements = {
  approveChangeNetwork,
  allowToSwitchNetwork,
  notificationPage,
  nextButton,
  connectButton,
  allowToSpendButton,
  rejectToSpendButton,
};

const confirmSignatureRequestButton = `${notificationPage} .request-signature__footer__sign-button`;
const rejectSignatureRequestButton = `${notificationPage} .request-signature__footer__cancel-button`;
export const signaturePageElements = {
  confirmSignatureRequestButton,
  rejectSignatureRequestButton,
};

// const permissionsPage = '.permissions-connect';
// // const connectButton = `text=Connect`;
// export const permissionsPageElements = {
//   permissionsPage,
//   // connectButton,
// };

const confirmPageHeader = `${notificationPage} .confirm-page-container-header`;
const confirmPageContent = `${notificationPage} .confirm-page-container-content`;
const confirmPageGasFeeSection = `${confirmPageContent} .confirm-page-container-content__gas-fee`;
const gasFeeLabel = `${confirmPageGasFeeSection} .currency-display-component__text`;
const gasFeeInput = `${confirmPageGasFeeSection} .advanced-gas-inputs__gas-edit-row:nth-child(1) .advanced-gas-inputs__gas-edit-row__input`;
const gasFeeArrowUpButton = `${confirmPageGasFeeSection} .advanced-gas-inputs__gas-edit-row:nth-child(1) .advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap:nth-child(1)`;
const gasFeeArrowDownButton = `${confirmPageGasFeeSection} .advanced-gas-inputs__gas-edit-row:nth-child(1) .advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap:nth-child(2)`;
const gasLimitInput = `${confirmPageGasFeeSection} .advanced-gas-inputs__gas-edit-row:nth-child(2) .advanced-gas-inputs__gas-edit-row__input`;
const gasLimitArrowUpButton = `${confirmPageGasFeeSection} .advanced-gas-inputs__gas-edit-row:nth-child(2) .advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap:nth-child(1)`;
const gasLimitArrowDownButton = `${confirmPageGasFeeSection} .advanced-gas-inputs__gas-edit-row:nth-child(2) .advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap:nth-child(2)`;
const totalLabel = `${confirmPageContent} div:nth-child(2) > .confirm-detail-row .currency-display-component__text`;
const rejectButton = `${confirmPageContent} [data-testid="page-container-footer-cancel"]`;
const confirmButton = `${confirmPageContent} [data-testid="page-container-footer-next"]`;
export const confirmPageElements = {
  notificationPage,
  confirmPageHeader,
  confirmPageContent,
  confirmPageGasFeeSection,
  gasFeeLabel,
  gasFeeInput,
  gasFeeArrowUpButton,
  gasFeeArrowDownButton,
  gasLimitInput,
  gasLimitArrowUpButton,
  gasLimitArrowDownButton,
  totalLabel,
  rejectButton,
  confirmButton,
};
