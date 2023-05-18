import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Tabs from 'components/Tabs';

import { ZkAccountContext } from 'contexts';

const tabs = [
  { name: 'Deposit', path: '/deposit' },
  { name: 'Transfer', path: '/transfer' },
  { name: 'Withdraw', path: '/withdraw' },
  { name: 'History', path: '/history', badge: true },
]

export default () => {
  const { isPendingIncoming } = useContext(ZkAccountContext);
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
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        showBadge={isPendingIncoming}
      />
    </>
  );
};
