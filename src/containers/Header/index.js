import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

import WalletModal from 'containers/WalletModal';
import AccountSetUpModal from 'components/AccountSetUpModal';
import Header from 'components/Header';
import { ethers } from 'ethers';

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
  const [zkAccount, setZkAccount] = useState();
  const [activeTab, setActiveTab] = useState(tabs.findIndex(item => item.path === history.location.pathname));
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSetUpAccountModalOpen, setIsSetUpAccountModalOpen] = useState(false);
  const handleTabClick = useCallback(index => {
    history.push(tabs[index].path);
    setActiveTab(index);
  }, []);
  const loadFromStorage = useCallback(() => {
    const privateKey = window.localStorage.getItem('zkAccountKey');
    let zkAccount = null;
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey);
      zkAccount = wallet.address;
    }
    setZkAccount(zkAccount);
  }, []);
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage, isSetUpAccountModalOpen]);
  return (
    <>
      <Header
        tabs={tabs.map(tab => tab.name)}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        openWalletModal={() => setIsWalletModalOpen(true)}
        openAccountSetUpModal={() => setIsSetUpAccountModalOpen(true)}
        account={account}
        zkAccount={zkAccount}
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <AccountSetUpModal isOpen={isSetUpAccountModalOpen} onClose={() => setIsSetUpAccountModalOpen(false)} />
    </>
  );
};
