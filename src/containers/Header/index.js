import React, { useContext, useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Header from 'components/Header';

import {
  ZkAccountContext, ModalContext,
  TokenBalanceContext, PoolContext,
} from 'contexts';

export default ({ empty }) => {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance, updateBalance, isLoadingBalance } = useContext(TokenBalanceContext);
  const {
    zkAccount, isLoadingZkAccount, balance: poolBalance,
    zkAccountId, updatePoolData, generateAddress, isDemo,
    isLoadingState, switchToPool, initializeGiftCard,
  } = useContext(ZkAccountContext);
  const {
    openWalletModal, openSeedPhraseModal,
    openAccountSetUpModal, openSwapModal,
    openChangePasswordModal, openConfirmLogoutModal,
  } = useContext(ModalContext);
  const { currentPool } = useContext(PoolContext);

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
        openSwapModal={openSwapModal}
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
        switchToPool={switchToPool}
        currentPool={currentPool}
        initializeGiftCard={initializeGiftCard}
      />
    </>
  );
};
