import React from 'react';

import TransferInput from 'components/TransferInput';

export default ({ amount, setAmount, isPoolToken, balance }) => {
  return (
    <TransferInput
      amount={amount}
      setAmount={setAmount}
      balance={balance}
      isPoolToken={isPoolToken}
    />
  );
};
