import React, { useState, useContext, useCallback, useEffect } from 'react';
import { verifyShieldedAddress } from 'zkbob-client-js/lib/utils';

import TransferInput from 'containers/TransferInput';
import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import LatestAction from 'components/LatestAction';

import { ZkAccountContext } from 'contexts';

const note = 'The transfer will be performed privately within the zero knowledge pool. Sender, recipient and amount are never disclosed.';

export default () => {
  const { zkAccount, balance, transfer, isLoadingState, history, isPending } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [latestAction, setLatestAction] = useState(null);

  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);

  const onTransfer = useCallback(() => {
    setIsConfirmModalOpen(false);
    setAmount('');
    setReceiver('');
    transfer(receiver, amount);
  }, [receiver, amount, transfer]);

  useEffect(() => {
    let latestAction = null;
    if (history?.length) {
      latestAction = history.find(item => [2, 3, 5].includes(item.type));
    }
    setLatestAction(latestAction);
  }, [history]);

  let button = null;
  if (zkAccount) {
    if (isLoadingState) {
      button = <Button $loading $contrast disabled>Updating zero pool state...</Button>;
    } else if (!(amount > 0)) {
      button = <Button disabled>Enter an amount</Button>;
    } else if (amount > balance) {
      button = <Button disabled>Insufficient shDAI balance</Button>;
    } else if (!receiver) {
      button = <Button disabled>Enter an address</Button>;
    } else if (!verifyShieldedAddress(receiver)) {
      button = <Button disabled>Invalid address</Button>;
    } else {
      button = <Button onClick={() => setIsConfirmModalOpen(true)}>Transfer</Button>;
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return isPending ? <PendingAction /> : (
    <>
      <Card title="Transfer" note={note}>
        <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
        <Input
          placeholder="Enter address of zkBob receiver"
          hint="The address can be generated in the account modal window"
          secondary
          value={receiver}
          onChange={handleReceiverChange}
        />
        {button}
        <ConfirmTransactionModal
          title="Transfer confirmation"
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={onTransfer}
          amount={amount}
          receiver={receiver}
          isPoolToken={true}
          isZkAddress={true}
        />
      </Card>
      {latestAction && (
        <LatestAction
          type="Transfer"
          isPoolToken={true}
          amount={latestAction.amount}
          txHash={latestAction.txHash}
        />
      )}
    </>
  );
};
