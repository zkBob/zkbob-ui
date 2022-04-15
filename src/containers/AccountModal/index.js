import { useContext, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

import { ZkAccountContext, WalletModalContext, TokenBalanceContext } from 'contexts';
import { useSelectedConnector } from 'hooks';
import AccountModal from 'components/AccountModal';

export default () => {
  const {
    isAccountModalOpen, closeAccountModal, openWalletModal, openAccountSetUpModal,
  } = useContext(WalletModalContext);
  const { account } = useWeb3React();
  const { balance } = useContext(TokenBalanceContext);
  const { zkAccount, balance: poolBalance, generateAddress } = useContext(ZkAccountContext);
  const connector = useSelectedConnector();
  const [privateAddress, setPrivateAddress] = useState(null);
  const generatePrivateAddress = useCallback(() => {
    setPrivateAddress(generateAddress());
  }, [generateAddress]);
  const onClose = useCallback(() => {
    closeAccountModal();
    setPrivateAddress(null);
  }, [closeAccountModal]);
  return (
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
    />
  );
}
