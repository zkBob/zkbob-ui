import React, { useState, useContext } from 'react';

import TransferInput from 'components/TransferInput';

import ethIcon from 'assets/eth.svg';
import zpEthIcon from 'assets/zp-eth.svg';

const tokens = [
  { name: 'ETH', icon: ethIcon },
  { name: 'zpETH', icon: zpEthIcon },
];

export default ({ amount, setAmount, isPoolToken, balance }) => {
  const [selectedToken, setSelectedToken] = useState(0);
  return (
    <TransferInput
      amount={amount}
      setAmount={setAmount}
      tokens={tokens}
      selectedToken={selectedToken}
      onTokenSelect={setSelectedToken}
      balance={balance}
      isPoolToken={isPoolToken}
    />
  );
};
