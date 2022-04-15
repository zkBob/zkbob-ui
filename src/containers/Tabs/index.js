import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Tabs from 'components/Tabs';

const tabs = [
  { name: 'Deposit', path: '/deposit' },
  { name: 'Transfer', path: '/transfer' },
  { name: 'Withdraw', path: '/withdraw' },
  { name: 'History', path: '/history' },
]

export default () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(tabs.findIndex(item => item.path === history.location.pathname));
  const handleTabClick = useCallback(index => {
    history.push(tabs[index].path);
    setActiveTab(index);
  }, []);
  return (
    <>
      <Tabs
        tabs={tabs.map(tab => tab.name)}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
    </>
  );
};
