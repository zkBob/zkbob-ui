import React, { useState } from 'react';

import Header from 'components/Header';

const tabs = ['Deposit', 'Transfer', 'Withdraw', 'History', 'Bridge'];

export default () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Header tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
  );
};
