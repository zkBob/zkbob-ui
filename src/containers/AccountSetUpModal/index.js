import { useContext } from 'react';

import { ModalContext, ZkAccountContext } from 'contexts';
import AccountSetUpModal from 'components/AccountSetUpModal';

export default () => {
  const {
    isAccountSetUpModalOpen, closeAccountSetUpModal, openWalletModal,
  } = useContext(ModalContext);
  const { zkAccount, saveZkAccountMnemonic } = useContext(ZkAccountContext);
  return (
    <AccountSetUpModal
      isOpen={isAccountSetUpModalOpen}
      onClose={closeAccountSetUpModal}
      openWalletModal={openWalletModal}
      zkAccount={zkAccount}
      saveZkAccountMnemonic={saveZkAccountMnemonic}
    />
  );
}
