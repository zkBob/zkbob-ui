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
  const [receiver, setReceiver] = useState(null);
  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);
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
      button = <Button gradient onClick={() => transfer(receiver, amount)}>Transfer</Button>;
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return (
    <Card title="Transfer" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
      <Input placeholder="Enter ZeroPool address of receiver" secondary onChange={handleReceiverChange} />
      {button}
    </Card>
  );
};
