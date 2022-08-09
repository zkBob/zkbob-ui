import React from 'react';

import TransferInput from 'components/TransferInput';

export default ({ amount, setAmount, shielded, balance, fee, setMax }) => {
  return (
    <TransferInput
      amount={amount}
      setAmount={setAmount}
      balance={balance}
      shielded={shielded}
      fee={fee}
      setMax={setMax}
    />
  );
};
