import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import Header from 'components/Header';

import { ZkAccountContext, WalletModalContext } from 'contexts';
import { useSelectedConnector } from 'hooks';

const tabs = [
  { name: 'Deposit', path: '/deposit' },
  { name: 'Transfer', path: '/transfer' },
  { name: 'Receive', path: '/receive' },
  { name: 'Withdraw', path: '/withdraw' },
  // { name: 'History', path: '/history' },
]

export default () => {
  const { account } = useWeb3React();
  const history = useHistory();
  const { zkAccount } = useContext(ZkAccountContext);
  const { openWalletModal, openAccountModal, openAccountSetUpModal } = useContext(WalletModalContext);
  const connector = useSelectedConnector();
  const [activeTab, setActiveTab] = useState(tabs.findIndex(item => item.path === history.location.pathname));
  const handleTabClick = useCallback(index => {
    history.push(tabs[index].path);
    setActiveTab(index);
  }, []);
  return (
    <>
      <Header
        tabs={tabs.map(tab => tab.name)}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        openWalletModal={openWalletModal}
        openAccountModal={openAccountModal}
        openAccountSetUpModal={openAccountSetUpModal}
        account={account}
        zkAccount={zkAccount}
        connector={connector}
      />
    </>
  );
};
