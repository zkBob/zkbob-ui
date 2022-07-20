import React from 'react';

import TransferInput from 'components/TransferInput';

export default ({ amount, setAmount, isPoolToken, balance, fee, setMax }) => {
  return (
    <TransferInput
      amount={amount}
      setAmount={setAmount}
      balance={balance}
      isPoolToken={isPoolToken}
      fee={fee}
      setMax={setMax}
    />
  );
};
