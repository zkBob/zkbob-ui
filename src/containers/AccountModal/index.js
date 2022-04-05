import { useContext } from 'react';
import { useWeb3React } from '@web3-react/core';

import { ZkAccountContext, WalletModalContext } from 'contexts';
import { useSelectedConnector } from 'hooks';
import AccountModal from 'components/AccountModal';

export default () => {
  const {
    isAccountModalOpen, closeAccountModal, openWalletModal, openAccountSetUpModal,
  } = useContext(WalletModalContext);
  const { account } = useWeb3React();
  const { zkAccount } = useContext(ZkAccountContext);
  const connector = useSelectedConnector();
  return (
    <AccountModal
      isOpen={isAccountModalOpen}
      onClose={closeAccountModal}
      account={account}
      zkAccount={zkAccount}
      changeAccount={openWalletModal}
      changeZkAccount={openAccountSetUpModal}
      connector={connector}
    />
  );
}
