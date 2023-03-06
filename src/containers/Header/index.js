import React, { useContext, useState, useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Header from 'components/Header';

import { ZkAccountContext, ModalContext, TokenBalanceContext } from 'contexts';

export default ({ empty }) => {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance, updateBalance } = useContext(TokenBalanceContext);
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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refresh = useCallback(async e => {
    e.stopPropagation();
    setIsRefreshing(true);
    await Promise.all([
      updateBalance(),
      updatePoolData(),
    ]);
    setIsRefreshing(false);
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
        poolBalance={poolBalance}
        zkAccountId={zkAccountId}
        isRefreshing={isRefreshing}
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
