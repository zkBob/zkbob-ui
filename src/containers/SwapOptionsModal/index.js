import { useContext, useCallback } from 'react';

import { ModalContext } from 'contexts';
import SwapOptionsModal from 'components/SwapOptionsModal';

export default () => {
  const {
    isSwapOptionsModalOpen, closeSwapOptionsModal, openSwapModal,
  } = useContext(ModalContext);

  const onOpenSwapModal = useCallback(() => {
    closeSwapOptionsModal();
    openSwapModal();
  }, [openSwapModal, closeSwapOptionsModal]);

  return (
    <SwapOptionsModal
      isOpen={isSwapOptionsModalOpen}
      onClose={closeSwapOptionsModal}
      openSwapModal={onOpenSwapModal}
    />
  );
}
