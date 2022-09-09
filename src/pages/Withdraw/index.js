import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { TxType } from 'zkbob-client-js';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import { ZkAccountContext } from 'contexts';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import LatestAction from 'components/LatestAction';
import Limits from 'components/Limits';

import { useFee } from 'hooks';

import { tokenSymbol } from 'utils/token';
import { formatNumber } from 'utils';

import { NETWORKS } from 'constants';

const note = `${tokenSymbol()} will be withdrawn from the zero knowledge pool and deposited into the selected account.`;

export default () => {
  const {
    zkAccount, balance, withdraw, isLoadingState,
    history, isPending, maxTransferable,
    limits, isLoadingLimits, minTxAmount,
  } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState(ethers.constants.Zero);
  const [displayAmount, setDisplayAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [latestAction, setLatestAction] = useState(null);
  const { fee, numberOfTxs } = useFee(amount, TxType.Withdraw);

  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, []);

  const onWihdrawal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setDisplayAmount('');
    setReceiver('');
    withdraw(receiver, amount);
  }, [receiver, amount, withdraw]);

  const setMax = useCallback(async () => {
    setDisplayAmount(ethers.utils.formatEther(maxTransferable));
  }, [maxTransferable]);

  useEffect(() => {
    let amount = ethers.constants.Zero;
    try {
      amount = ethers.utils.parseEther(displayAmount);
    } catch (error) {}
    setAmount(amount);
  }, [displayAmount]);

  useEffect(() => {
    let latestAction = null;
    if (history?.length) {
      latestAction = history.find(item => item.type === 4);
    }
    setLatestAction(latestAction);
  }, [history]);

  let button = null;
  if (zkAccount) {
    if (isLoadingState || isLoadingLimits) {
      button = <Button $loading $contrast disabled>Updating zero pool state...</Button>;
    } else if (amount.isZero()) {
      button = <Button disabled>Enter an amount</Button>;
    } else if (amount.lt(minTxAmount)) {
      button = <Button disabled>Min amount is {formatNumber(minTxAmount)} {tokenSymbol()}</Button>
    } else if (amount.gt(maxTransferable)) {
      button = <Button disabled>Insufficient {tokenSymbol(true)} balance</Button>;
    } else if (amount.gt(limits.dailyWithdrawalLimit.available)) {
      button = <Button disabled>Limit exceeded</Button>;
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
          amount={displayAmount}
          onChange={setDisplayAmount}
          shielded={true}
          fee={fee}
          setMax={setMax}
        />
        <Input
          placeholder={`Enter ${NETWORKS[process.env.REACT_APP_NETWORK].name} address of receiver`}
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
          shielded={true}
          fee={fee}
          numberOfTxs={numberOfTxs}
          type="withdrawal"
        />
      </Card>
      <Limits
        limits={[
          { name: "Daily withdrawal", values: limits.dailyWithdrawalLimit },
        ]}
      />
      {latestAction && (
        <LatestAction
          type="Withdrawal"
          shielded={true}
          amount={latestAction.amount}
          txHash={latestAction.txHash}
        />
      )}
    </>
  );
};
