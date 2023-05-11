import { useContext } from 'react';

import { ModalContext, ZkAccountContext } from 'contexts';
import AccountSetUpModal from 'components/AccountSetUpModal';

export default () => {
  const {
    isAccountSetUpModalOpen,
    closeAccountSetUpModal,
    closePasswordModal,
  } = useContext(ModalContext);
  const { saveZkAccountMnemonic } = useContext(ZkAccountContext);

  return (
    <AccountSetUpModal
      isOpen={isAccountSetUpModalOpen}
      onClose={closeAccountSetUpModal}
      saveZkAccountMnemonic={saveZkAccountMnemonic}
      closePasswordModal={closePasswordModal}
    />
  );
}
