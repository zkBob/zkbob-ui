import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

import TransferInput from 'containers/TransferInput';
import AccountSetUpButton from 'containers/AccountSetUpButton';

import { ZkAccountContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import LatestAction from 'components/LatestAction';

const note = 'Amount withdrawn from zero knowledge pool will be deposited to the selected account.';

export default () => {
  const { zkAccount, balance, withdraw, isLoadingState, history } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [latestAction, setLatestAction] = useState(null);

  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);

  const onWihdrawal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setAmount('');
    setReceiver('');
    withdraw(receiver, amount);
  }, [receiver, amount, withdraw]);

  useEffect(() => {
    let latestAction = null;
    if (history?.length) {
      latestAction = history.find(item => item.type === 4);
    }
    setLatestAction(latestAction);
  }, [history]);

  let button = null;
  if (zkAccount) {
    if (isLoadingState) {
      button = <Button $loading disabled>Loading zero pool state...</Button>;
    } else if (!(amount > 0)) {
      button = <Button disabled>Enter an amount</Button>;
    } else if (amount > balance) {
      button = <Button disabled>Insufficient shDAI balance</Button>;
    } else if (!receiver) {
      button = <Button disabled>Enter an address</Button>;
    } else if (!ethers.utils.isAddress(receiver)) {
      button = <Button disabled>Invalid address</Button>;
    } else {
      button = <Button onClick={() => setIsConfirmModalOpen(true)}>Withdraw</Button>;
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return (
    <>
      <Card title="Withdraw" note={note}>
        <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
        <Input
          placeholder="Enter Kovan address of receiver"
          secondary
          value={receiver}
          onChange={handleReceiverChange}
        />
        {button}
        <ConfirmTransactionModal
          title="Withdrawal confirmation"
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={onWihdrawal}
          amount={amount}
          receiver={receiver}
          isPoolToken={true}
        />
      </Card>
      {latestAction && (
        <LatestAction
          type="Withdrawal"
          isPoolToken={true}
          amount={latestAction.amount}
          txHash={latestAction.txHash}
        />
      )}
    </>
  );
};
