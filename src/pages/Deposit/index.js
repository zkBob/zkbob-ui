import React, { useState, useContext } from 'react';

import TransferInput from 'containers/TransferInput';

import { ZkAccountContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';

const note = 'Eth from your account will be deposited to your ZeroPool address via relayer.';

export default () => {
  const [amount, setAmount] = useState(0);
  const { deposit } = useContext(ZkAccountContext);
  return (
    <Card title="Deposit" note={note}>
      <TransferInput amount={amount} setAmount={setAmount} />
      <Button gradient onClick={() => deposit(amount)}>Deposit</Button>
    </Card>
  );
};
