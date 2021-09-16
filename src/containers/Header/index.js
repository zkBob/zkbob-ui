import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Header from 'components/Header';

const tabs = [
  { name: 'Deposit', path: '/deposit' },
  { name: 'Transfer', path: '/transfer' },
  { name: 'Withdraw', path: '/withdraw' },
  { name: 'History', path: '/history' },
  { name: 'Bridge', path: '/' },
]

export default () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(tabs.findIndex(item => item.path === history.location.pathname));
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const handleTabClick = useCallback(index => {
    history.push(tabs[index].path);
    setActiveTab(index);
  }, []);
  return (
    <Header
      tabs={tabs.map(tab => tab.name)}
      activeTab={activeTab}
      onTabClick={handleTabClick}
      isWalletModalOpen={isWalletModalOpen}
      openWalletModal={() => setIsWalletModalOpen(true)}
      closeWalletModal={() => setIsWalletModalOpen(false)}
    />
  );
};
