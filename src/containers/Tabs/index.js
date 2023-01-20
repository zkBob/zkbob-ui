import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Tabs from 'components/Tabs';

const tabs = [
  { name: 'Deposit', path: '/deposit' },
  { name: 'Transfer', path: '/transfer' },
  { name: 'Withdraw', path: '/withdraw' },
  { name: 'History', path: '/history' },
]

export default () => {
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null);
  const handleTabClick = useCallback(index => {
    history.push(tabs[index].path + location.search);
  }, [history, location]);
  useEffect(() => {
    setActiveTab(tabs.findIndex(item => item.path === location.pathname));
  }, [location]);
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
