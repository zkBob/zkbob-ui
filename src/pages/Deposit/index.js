import React, { useState, useContext, useCallback } from 'react';

import TransferInput from 'containers/TransferInput';
import TransactionModal from 'components/TransactionModal';

import { ZkAccountContext, TokenBalanceContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';

const note = 'DAI from your account will be deposited to your ZeroPool address via relayer.';

export default () => {
  const { deposit } = useContext(ZkAccountContext);
  const { balance } = useContext(TokenBalanceContext);
  const [amount, setAmount] = useState(0);
  const handleDeposit = useCallback(async () => {
    await deposit(amount);
  }, [amount]);
  return (
    <Card title="Deposit" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={false} />
      <Button gradient onClick={handleDeposit}>Deposit</Button>
    </Card>
  );
};
