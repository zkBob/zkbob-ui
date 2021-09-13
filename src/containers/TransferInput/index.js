import React, { useState } from 'react';

import TransferInput from 'components/TransferInput';

import ethIcon from 'assets/eth.svg';
import zpEthIcon from 'assets/zp-eth.svg';

const tokens = [
  { name: 'ETH', icon: ethIcon },
  { name: 'zpETH', icon: zpEthIcon },
];

export default () => {
  const [selectedToken, setSelectedToken] = useState(0);
  return (
    <TransferInput tokens={tokens} selectedToken={selectedToken} onTokenSelect={setSelectedToken} />
  );
};
