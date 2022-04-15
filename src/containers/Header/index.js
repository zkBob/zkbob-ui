import React, { useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import Header from 'components/Header';

import { ZkAccountContext, WalletModalContext, TokenBalanceContext } from 'contexts';
import { useSelectedConnector } from 'hooks';


export default () => {
  const { account } = useWeb3React();
  const { balance } = useContext(TokenBalanceContext);
  const { zkAccount, isLoadingZkAccount, balance: poolBalance } = useContext(ZkAccountContext);
  const { openWalletModal, openAccountModal, openAccountSetUpModal } = useContext(WalletModalContext);
  const connector = useSelectedConnector();
  return (
    <>
      <Header
        openWalletModal={openWalletModal}
        openAccountModal={openAccountModal}
        openAccountSetUpModal={openAccountSetUpModal}
        account={account}
        zkAccount={zkAccount}
        isLoadingZkAccount={isLoadingZkAccount}
        connector={connector}
        balance={balance}
        poolBalance={poolBalance}
      />
    </>
  );
};
