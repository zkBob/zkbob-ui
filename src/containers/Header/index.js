import React, { useContext, useState, useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Header from 'components/Header';

import { ZkAccountContext, ModalContext, TokenBalanceContext } from 'contexts';

export default ({ empty }) => {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance, updateBalance, isLoadingBalance } = useContext(TokenBalanceContext);
  const {
    zkAccount, isLoadingZkAccount, balance: poolBalance,
    zkAccountId, updatePoolData, generateAddress, isDemo,
    isLoadingState,
  } = useContext(ZkAccountContext);
  const {
    openWalletModal, openSeedPhraseModal,
    openAccountSetUpModal, openSwapOptionsModal,
    openChangePasswordModal, openConfirmLogoutModal,
  } = useContext(ModalContext);

  const refresh = useCallback(e => {
    e.stopPropagation();
    updateBalance();
    updatePoolData();
  }, [updateBalance, updatePoolData]);

  return (
    <>
      <Header
        openWalletModal={openWalletModal}
        openAccountSetUpModal={openAccountSetUpModal}
        openSwapModal={openSwapOptionsModal}
        openChangePasswordModal={openChangePasswordModal}
        openConfirmLogoutModal={openConfirmLogoutModal}
        account={address}
        zkAccount={zkAccount}
        isLoadingZkAccount={isLoadingZkAccount}
        isLoadingState={isLoadingState}
        connector={connector}
        balance={balance}
        isLoadingBalance={isLoadingBalance}
        poolBalance={poolBalance}
        zkAccountId={zkAccountId}
        refresh={refresh}
        empty={empty}
        generateAddress={generateAddress}
        openSeedPhraseModal={openSeedPhraseModal}
        isDemo={isDemo}
        disconnect={disconnect}
      />
    </>
  );
};
