import React, { useState, useContext, useCallback } from 'react';

import TransferInput from 'containers/TransferInput';
import AccountSetUpButton from 'containers/AccountSetUpButton';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';

import { ZkAccountContext } from 'contexts';

const note = 'This transfer will happen within ZeroPool and will be truly private.';

export default () => {
  const { zkAccount, balance, transfer } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState(null);
  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);
  return (
    <Card title="Transfer" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
      <Input placeholder="Enter ZeroPool address of receiver" secondary onChange={handleReceiverChange} />
      {zkAccount ? (
        <Button gradient onClick={() => transfer(receiver, amount)}>Transfer</Button>
      ) : (
        <AccountSetUpButton />
      )}
    </Card>
  );
};
