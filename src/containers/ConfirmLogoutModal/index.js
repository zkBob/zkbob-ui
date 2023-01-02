import { useContext, useCallback } from 'react';

import ConfirmLogoutModal from 'components/ConfirmLogoutModal';

import { ZkAccountContext, ModalContext } from 'contexts';

export default () => {
  const { isConfirmLogoutModalOpen, closeConfirmLogoutModal } = useContext(ModalContext);
  const { removeZkAccountMnemonic } = useContext(ZkAccountContext);

  const confirmLogout = useCallback(() => {
    closeConfirmLogoutModal(false);
    removeZkAccountMnemonic();
  }, [closeConfirmLogoutModal, removeZkAccountMnemonic]);

  return (
    <ConfirmLogoutModal
      isOpen={isConfirmLogoutModalOpen}
      onClose={closeConfirmLogoutModal}
      onConfirm={confirmLogout}
    />
  );
}
