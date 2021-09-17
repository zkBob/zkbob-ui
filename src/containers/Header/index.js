import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

import WalletModal from 'containers/WalletModal';
import AccountSetUpModal from 'components/AccountSetUpModal';
import Header from 'components/Header';

const tabs = [
  { name: 'Deposit', path: '/deposit' },
  { name: 'Transfer', path: '/transfer' },
  { name: 'Withdraw', path: '/withdraw' },
  { name: 'History', path: '/history' },
  { name: 'Bridge', path: '/' },
]

export default () => {
  const { account } = useWeb3React();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(tabs.findIndex(item => item.path === history.location.pathname));
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSetUpAccountModalOpen, setIsSetUpAccountModalOpen] = useState(false);
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
        openWalletModal={() => setIsWalletModalOpen(true)}
        openAccountSetUpModal={() => setIsSetUpAccountModalOpen(true)}
        account={account}
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <AccountSetUpModal isOpen={isSetUpAccountModalOpen} onClose={() => setIsSetUpAccountModalOpen(false)} />
    </>
  );
};
