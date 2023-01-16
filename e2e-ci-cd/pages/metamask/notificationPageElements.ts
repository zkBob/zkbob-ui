const NOTIFICATION_PAGE = '.notification';
const nextButton = `${NOTIFICATION_PAGE} .permissions-connect-choose-account__bottom-buttons button:nth-child(2)`;
const allowToSpendButton = `${NOTIFICATION_PAGE} [data-testid="page-container-footer-next"]`;
const rejectToSpendButton = `${NOTIFICATION_PAGE} [data-testid="page-container-footer-cancel"]`;
export const notificationPageElements = {
  NOTIFICATION_PAGE,
  nextButton,
  allowToSpendButton,
  rejectToSpendButton,
};

const confirmSignatureRequestButton = `${NOTIFICATION_PAGE} .request-signature__footer__sign-button`;
const rejectSignatureRequestButton = `${NOTIFICATION_PAGE} .request-signature__footer__cancel-button`;
export const signaturePageElements = {
  confirmSignatureRequestButton,
  rejectSignatureRequestButton,
};

const PERMISSIONS_PAGE = '.permissions-connect';
const connectButton = `${PERMISSIONS_PAGE} .permission-approval-container__footers button:nth-child(2)`;
export const permissionsPageElements = {
  PERMISSIONS_PAGE,
  connectButton,
};

const confirmPageHeader = `${NOTIFICATION_PAGE} .confirm-page-container-header`;
const CONFIRM_PAGE_CONTENT = `${NOTIFICATION_PAGE} .confirm-page-container-content`;
const CONFIRM_PAGE_GAS_FEE_SECTION = `${CONFIRM_PAGE_CONTENT} .confirm-page-container-content__gas-fee`;
const gasFeeLabel = `${CONFIRM_PAGE_GAS_FEE_SECTION} .currency-display-component__text`;
const gasFeeInput = `${CONFIRM_PAGE_GAS_FEE_SECTION} .advanced-gas-inputs__gas-edit-row:nth-child(1) .advanced-gas-inputs__gas-edit-row__input`;
const gasFeeArrowUpButton = `${CONFIRM_PAGE_GAS_FEE_SECTION} .advanced-gas-inputs__gas-edit-row:nth-child(1) .advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap:nth-child(1)`;
const gasFeeArrowDownButton = `${CONFIRM_PAGE_GAS_FEE_SECTION} .advanced-gas-inputs__gas-edit-row:nth-child(1) .advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap:nth-child(2)`;
const gasLimitInput = `${CONFIRM_PAGE_GAS_FEE_SECTION} .advanced-gas-inputs__gas-edit-row:nth-child(2) .advanced-gas-inputs__gas-edit-row__input`;
const gasLimitArrowUpButton = `${CONFIRM_PAGE_GAS_FEE_SECTION} .advanced-gas-inputs__gas-edit-row:nth-child(2) .advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap:nth-child(1)`;
const gasLimitArrowDownButton = `${CONFIRM_PAGE_GAS_FEE_SECTION} .advanced-gas-inputs__gas-edit-row:nth-child(2) .advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap:nth-child(2)`;
const totalLabel = `${CONFIRM_PAGE_CONTENT} div:nth-child(2) > .confirm-detail-row .currency-display-component__text`;
const rejectButton = `${CONFIRM_PAGE_CONTENT} [data-testid="page-container-footer-cancel"]`;
const confirmButton = `${CONFIRM_PAGE_CONTENT} [data-testid="page-container-footer-next"]`;
export const confirmPageElements = {
  NOTIFICATION_PAGE,
  confirmPageHeader,
  CONFIRM_PAGE_CONTENT,
  CONFIRM_PAGE_GAS_FEE_SECTION,
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
