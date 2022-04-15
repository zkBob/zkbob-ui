import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import Header from 'components/Header';

import { ZkAccountContext, WalletModalContext } from 'contexts';
import { useSelectedConnector } from 'hooks';


export default () => {
  const { account } = useWeb3React();
  const { zkAccount, isLoadingZkAccount } = useContext(ZkAccountContext);
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
      />
    </>
  );
};
