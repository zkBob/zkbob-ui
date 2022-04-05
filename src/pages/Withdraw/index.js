import React, { useState, useCallback, useContext } from 'react';

import TransferInput from 'containers/TransferInput';
import AccountSetUpButton from 'containers/AccountSetUpButton';

import { ZkAccountContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';

const note = 'Amount withdrawn from zero knowledge pool will be deposited to the selected account.';

export default () => {
  const { zkAccount, balance, withdraw, isLoadingState } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState(null);
  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);
  return (
    <Card title="Withdraw" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
      <Input placeholder="Enter xDai address of receiver" secondary onChange={handleReceiverChange} />
      {zkAccount ? (
        isLoadingState ? (
          <Button disabled>Loading zero pool state...</Button>
        ) : (
          <Button gradient onClick={() => withdraw(receiver, amount)}>Withdraw</Button>
        )
      ) : (
        <AccountSetUpButton />
      )}
    </Card>
  );
};
