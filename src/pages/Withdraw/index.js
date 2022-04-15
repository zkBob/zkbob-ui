import React, { useState, useCallback, useContext } from 'react';
import { ethers } from 'ethers';

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
  const [receiver, setReceiver] = useState('');
  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);
  const onWihdrawal = useCallback(() => {
    setAmount(0);
    setReceiver('');
    withdraw(receiver, amount);
  }, [receiver, amount, withdraw]);
  let button = null;
  if (zkAccount) {
    if (isLoadingState) {
      button = <Button loading disabled>Loading zero pool state...</Button>;
    } else if (!(amount > 0)) {
      button = <Button disabled>Enter an amount</Button>;
    } else if (amount > balance) {
      button = <Button disabled>Insufficient shDAI balance</Button>;
    } else if (!receiver) {
      button = <Button disabled>Enter an address</Button>;
    } else if (!ethers.utils.isAddress(receiver)) {
      button = <Button disabled>Invalid address</Button>;
    } else {
      button = <Button onClick={onWihdrawal}>Withdraw</Button>;
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return (
    <Card title="Withdraw" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
      <Input
        placeholder="Enter Kovan address of receiver"
        secondary
        value={receiver}
        onChange={handleReceiverChange}
      />
      {button}
    </Card>
  );
};
