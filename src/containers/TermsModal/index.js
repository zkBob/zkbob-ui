import { useState, useContext, useCallback, useEffect } from 'react';

import { ModalContext } from 'contexts';
import TermsModal from 'components/TermsModal';

const ACKNOWLEDGE_THE_TERMS = 'acknowledge_the_terms';

export default () => {
  const {
    isAccountSetUpModalOpen, openAccountSetUpModal, closeAccountSetUpModal,
    isWalletModalOpen, openWalletModal, closeWalletModal,
    isPasswordModalOpen, openPasswordModal, closePasswordModal,
    isTermsModalOpen, openTermsModal, closeTermsModal,
  } = useContext(ModalContext);

  const [reopenLastModal, setReopenLastModal] = useState(null);

  useEffect(() => {
    const agreement = window.localStorage.getItem(ACKNOWLEDGE_THE_TERMS);
    const isAnyModalOpen = isAccountSetUpModalOpen || isWalletModalOpen || isPasswordModalOpen;
    if (agreement !== 'true' && isAnyModalOpen) {
      openTermsModal();
      if (isAccountSetUpModalOpen) {
        setReopenLastModal(() => openAccountSetUpModal);
        closeAccountSetUpModal();
      } else if (isWalletModalOpen) {
        setReopenLastModal(() => openWalletModal);
        closeWalletModal();
      } else if (isPasswordModalOpen) {
        setReopenLastModal(() => openPasswordModal);
        closePasswordModal();
      }
    }
  }, [
    isAccountSetUpModalOpen, openAccountSetUpModal, closeAccountSetUpModal,
    isWalletModalOpen, openWalletModal, closeWalletModal,
    isPasswordModalOpen, openPasswordModal, closePasswordModal,
    openTermsModal,
  ]);

  const confirm = useCallback(async () => {
    window.localStorage.setItem(ACKNOWLEDGE_THE_TERMS, 'true');
    closeTermsModal();
    if (reopenLastModal) {
      reopenLastModal();
    }
  }, [closeTermsModal, reopenLastModal]);

  const cancel = useCallback(async () => {
    closeTermsModal();
  }, [closeTermsModal]);

  return <TermsModal isOpen={isTermsModalOpen} confirm={confirm} cancel={cancel} />;
}
