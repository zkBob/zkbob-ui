import { useContext } from 'react';

import { ModalContext, ZkAccountContext, WalletScreeningContext } from 'contexts';
import AccountSetUpModal from 'components/AccountSetUpModal';

export default () => {
  const {
    isAccountSetUpModalOpen, closeAccountSetUpModal, openWalletModal,
  } = useContext(ModalContext);
  const { zkAccount, saveZkAccountMnemonic } = useContext(ZkAccountContext);
  const { isSuspiciousAddress } = useContext(WalletScreeningContext);
  return (
    <AccountSetUpModal
      isOpen={isAccountSetUpModalOpen}
      onClose={closeAccountSetUpModal}
      openWalletModal={openWalletModal}
      zkAccount={zkAccount}
      saveZkAccountMnemonic={saveZkAccountMnemonic}
      isSuspiciousAddress={isSuspiciousAddress}
    />
  );
}
