import { useContext, useCallback, useEffect } from 'react';

import { ModalContext } from 'contexts';
import TermsModal from 'components/TermsModal';

const ACKNOWLEDGE_THE_TERMS = 'acknowledge_the_terms';

export default () => {
  const { isTermsModalOpen, openTermsModal, closeTermsModal } = useContext(ModalContext);

  useEffect(() => {
    const agreement = window.localStorage.getItem(ACKNOWLEDGE_THE_TERMS);
    if (agreement !== 'true') {
      openTermsModal();
    }
  }, []);

  const confirm = useCallback(async () => {
    window.localStorage.setItem(ACKNOWLEDGE_THE_TERMS, 'true');
    closeTermsModal();
  }, [closeTermsModal]);

  return <TermsModal isOpen={isTermsModalOpen} confirm={confirm} />;
}
