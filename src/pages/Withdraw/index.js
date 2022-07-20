import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { TxType } from 'zkbob-client-js';

import TransferInput from 'containers/TransferInput';
import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import { ZkAccountContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import LatestAction from 'components/LatestAction';

import { useFee } from 'hooks';

const note = 'shDAI is withdrawn from the zero knowledge pool and deposited as DAI into the selected account.';

export default () => {
  const {
    zkAccount, balance, withdraw, isLoadingState,
    history, isPending, getMaxTransferable,
  } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [latestAction, setLatestAction] = useState(null);
  const { fee, numberOfTxs } = useFee(amount, TxType.Withdraw);

  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);

  const onWihdrawal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setAmount('');
    setReceiver('');
    withdraw(receiver, amount);
  }, [receiver, amount, withdraw]);

  const setMax = useCallback(async () => {
    setAmount(maxAmount);
  }, [maxAmount]);

  useEffect(() => {
    async function update() {
      const max = await getMaxTransferable();
      setMaxAmount(String(max));
    }
    update();
  }, [getMaxTransferable]);

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
      button = <Button $loading $contrast disabled>Updating zero pool state...</Button>;
    } else if (!(amount > 0)) {
      button = <Button disabled>Enter an amount</Button>;
    } else if (amount > maxAmount) {
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
  return isPending ? <PendingAction /> : (
    <>
      <Card title="Withdraw" note={note}>
        <TransferInput
          balance={balance}
          amount={amount}
          setAmount={setAmount}
          isPoolToken={true}
          fee={fee}
          setMax={setMax}
        />
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
          fee={fee}
          numberOfTxs={numberOfTxs}
          type="withdrawal"
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
