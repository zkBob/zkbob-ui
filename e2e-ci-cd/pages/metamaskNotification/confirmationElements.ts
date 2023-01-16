const CONFIRMATION_PAGE = '.confirmation-page';
const confirmationPageFooter = `${CONFIRMATION_PAGE} .confirmation-footer`;
const footer = {
  footer: confirmationPageFooter,
  cancelButton: `${confirmationPageFooter} .btn-secondary`,
  approveButton: `${confirmationPageFooter} .btn-primary`,
};

export const confirmationElements = {
  CONFIRMATION_PAGE,
  footer,
};

const APPROVE_PAGE = '#app-content';
const APPROVE_PAGE_FOOTER = `${APPROVE_PAGE} .page-container__footer`;
const approveFooter = {
  footer: APPROVE_PAGE_FOOTER,
  cancelButton: `${APPROVE_PAGE_FOOTER} [data-testid="page-container-footer-cancel"]`,
  approveButton: `${APPROVE_PAGE_FOOTER} [data-testid="page-container-footer-next"]`,
};

export const approveElements = {
  APPROVE_PAGE,
  approveFooter,
};
