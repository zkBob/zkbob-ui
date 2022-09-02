import React, { useState, useContext, useCallback, useEffect } from 'react';
import { verifyShieldedAddress } from 'zkbob-client-js/lib/utils';
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import LatestAction from 'components/LatestAction';

import { ZkAccountContext } from 'contexts';

import { useFee } from 'hooks';

import { tokenSymbol } from 'utils/token';

const note = 'The transfer will be performed privately within the zero knowledge pool. Sender, recipient and amount are never disclosed.';

export default () => {
  const {
    zkAccount, balance, transfer, isLoadingState,
    history, isPending, getMaxTransferable,
  } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState(ethers.constants.Zero);
  const [displayAmount, setDisplayAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState(ethers.constants.Zero);
  const [receiver, setReceiver] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [latestAction, setLatestAction] = useState(null);
  const { fee, numberOfTxs } = useFee(amount, TxType.Transfer);

  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);

  const onTransfer = useCallback(() => {
    setIsConfirmModalOpen(false);
    setDisplayAmount('');
    setReceiver('');
    transfer(receiver, amount);
  }, [receiver, amount, transfer]);

  const setMax = useCallback(async () => {
    setDisplayAmount(ethers.utils.formatEther(maxAmount));
  }, [maxAmount]);

  useEffect(() => {
    setAmount(displayAmount ? ethers.utils.parseEther(displayAmount) : ethers.constants.Zero);
  }, [displayAmount]);

  useEffect(() => {
    async function update() {
      const max = await getMaxTransferable();
      setMaxAmount(max);
    }
    update();
  }, [getMaxTransferable]);

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
    } else if (amount.isZero()) {
      button = <Button disabled>Enter an amount</Button>;
    } else if (amount.gt(maxAmount)) {
      button = <Button disabled>Insufficient {tokenSymbol(true)} balance</Button>;
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
        <TransferInput
          balance={balance}
          amount={displayAmount}
          onChange={setDisplayAmount}
          shielded={true}
          fee={fee}
          setMax={setMax}
        />
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
          shielded={true}
          isZkAddress={true}
          fee={fee}
          numberOfTxs={numberOfTxs}
          type="transfer"
        />
      </Card>
      {latestAction && (
        <LatestAction
          type="Transfer"
          shielded={true}
          amount={latestAction.amount}
          txHash={latestAction.txHash}
        />
      )}
    </>
  );
};
