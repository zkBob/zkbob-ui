import React, { useContext, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import Header from 'components/Header';

import { ZkAccountContext, ModalContext, TokenBalanceContext } from 'contexts';
import { useSelectedConnector } from 'hooks';


export default () => {
  const { account } = useWeb3React();
  const { balance, updateBalance } = useContext(TokenBalanceContext);
  const {
    zkAccount, isLoadingZkAccount, balance: poolBalance,
    zkAccountId, updateBalance: updatePoolBalance, updateHistory,
  } = useContext(ZkAccountContext);
  const { openWalletModal, openAccountModal, openAccountSetUpModal } = useContext(ModalContext);
  const connector = useSelectedConnector();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refresh = useCallback(async e => {
    e.stopPropagation();
    setIsRefreshing(true);
    await Promise.all([
      updateBalance(),
      updatePoolBalance(),
      updateHistory(),
    ]);
    setIsRefreshing(false);
  }, [updateBalance, updatePoolBalance, updateHistory]);

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
        zkAccountId={zkAccountId}
        isRefreshing={isRefreshing}
        refresh={refresh}
      />
    </>
  );
};
