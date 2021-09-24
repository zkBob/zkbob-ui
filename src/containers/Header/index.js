import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import WalletModal from 'containers/WalletModal';
import AccountModal from 'containers/AccountModal';
import AccountSetUpModal from 'components/AccountSetUpModal';
import Header from 'components/Header';

import { ZkAccountContext } from 'contexts';

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
  const { zkAccount, saveZkAccountKey } = useContext(ZkAccountContext);
  const [activeTab, setActiveTab] = useState(tabs.findIndex(item => item.path === history.location.pathname));
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
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
        openAccountModal={() => setIsAccountModalOpen(true)}
        openAccountSetUpModal={() => setIsSetUpAccountModalOpen(true)}
        account={account}
        zkAccount={zkAccount}
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        changeAccount={() => setIsWalletModalOpen(true)}
        changeZkAccount={() => setIsSetUpAccountModalOpen(true)}
      />
      <AccountSetUpModal
        isOpen={isSetUpAccountModalOpen}
        onClose={() => setIsSetUpAccountModalOpen(false)}
        saveZkAccountKey={saveZkAccountKey}
      />
    </>
  );
};
