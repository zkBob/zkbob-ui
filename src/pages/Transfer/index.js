import React, { useState, useContext, useCallback } from 'react';

import TransferInput from 'containers/TransferInput';
import AccountSetUpButton from 'containers/AccountSetUpButton';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';

import { ZkAccountContext } from 'contexts';

const note = 'This transfer will happen within ZeroPool and will be truly private.';

export default () => {
  const { zkAccount, balance, transfer, isLoadingState } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState('');
  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);
  const onTransfer = useCallback(() => {
    setAmount(0);
    setReceiver('');
    transfer(receiver, amount);
  }, [receiver, amount, transfer]);
  let button = null;
  if (zkAccount) {
    if (isLoadingState) {
      button = <Button disabled>Loading zero pool state...</Button>;
    } else if (!(amount > 0)) {
      button = <Button disabled>Enter an amount</Button>;
    } else if (amount > balance) {
      button = <Button disabled>Insufficient shDAI balance</Button>;
    } else if (!receiver) {
      button = <Button disabled>Enter an address</Button>;
    } else if (receiver.length !== 63) {
      button = <Button disabled>Invalid address</Button>;
    } else {
      button = <Button gradient onClick={onTransfer}>Transfer</Button>;
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return (
    <Card title="Transfer" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
      <Input
        placeholder="Enter ZeroPool address of receiver"
        secondary
        value={receiver}
        onChange={handleReceiverChange}
      />
      {button}
    </Card>
  );
};
