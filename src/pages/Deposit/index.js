import React, { useState, useContext } from 'react';

import TransferInput from 'containers/TransferInput';

import { ZkAccountContext, TokenBalanceContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';

const note = 'DAI from your account will be deposited to your ZeroPool address via relayer.';

export default () => {
  const { deposit } = useContext(ZkAccountContext);
  const { balance } = useContext(TokenBalanceContext);
  const [amount, setAmount] = useState(0);
  return (
    <Card title="Deposit" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={false} />
      <Button gradient onClick={() => deposit(amount)}>Deposit</Button>
    </Card>
  );
};
