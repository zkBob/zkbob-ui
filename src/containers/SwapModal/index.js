import { useContext, useCallback } from 'react';

import { ModalContext } from 'contexts';
import LiFiWidget from 'containers/LiFiWidget';
import Modal from 'components/Modal';

export default () => {
  const {
    isSwapModalOpen, closeSwapModal, openSwapOptionsModal,
  } = useContext(ModalContext);

  const goBack = useCallback(() => {
    closeSwapModal();
    openSwapOptionsModal();
  }, [openSwapOptionsModal, closeSwapModal]);

  return (
    <Modal
      isOpen={isSwapModalOpen}
      onClose={closeSwapModal}
      onBack={goBack}
      width={480}
      style={{ padding: '26px 0 0' }}
    >
      <LiFiWidget />
    </Modal>
  );
}
