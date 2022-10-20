import { useContext, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

import { ZkAccountContext, ModalContext, TokenBalanceContext } from 'contexts';
import { useSelectedConnector } from 'hooks';
import AccountModal from 'components/AccountModal';
import ConfirmLogoutModal from 'components/ConfirmLogoutModal';

export default () => {
  const {
    isAccountModalOpen, closeAccountModal, openAccountModal,
    openWalletModal, openAccountSetUpModal, openChangePasswordModal,
  } = useContext(ModalContext);
  const { account } = useWeb3React();
  const { balance } = useContext(TokenBalanceContext);
  const {
    zkAccount, balance: poolBalance, generateAddress,
    zkAccountId, removeZkAccountMnemonic,
  } = useContext(ZkAccountContext);
  const connector = useSelectedConnector();
  const [privateAddress, setPrivateAddress] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const generatePrivateAddress = useCallback(() => {
    setPrivateAddress(generateAddress());
  }, [generateAddress]);

  const onClose = useCallback(() => {
    closeAccountModal();
    setPrivateAddress(null);
  }, [closeAccountModal]);

  const openConfirmLogoutModal = useCallback(() => {
    closeAccountModal();
    setIsConfirmModalOpen(true);
  }, [closeAccountModal]);

  const closeConfirmLogoutModal = useCallback(() => {
    openAccountModal();
    setIsConfirmModalOpen(false);
  }, [openAccountModal]);

  const confirmLogout = useCallback(() => {
    setIsConfirmModalOpen(false);
    removeZkAccountMnemonic();
  }, [removeZkAccountMnemonic]);

  return (
    <>
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={onClose}
        account={account}
        zkAccount={zkAccount}
        changeAccount={openWalletModal}
        changeZkAccount={openAccountSetUpModal}
        connector={connector}
        balance={balance}
        poolBalance={poolBalance}
        privateAddress={privateAddress}
        generatePrivateAddress={generatePrivateAddress}
        zkAccountId={zkAccountId}
        logout={openConfirmLogoutModal}
        changePassword={openChangePasswordModal}
      />
      <ConfirmLogoutModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmLogoutModal}
        onConfirm={confirmLogout}
      />
    </>
  );
}
