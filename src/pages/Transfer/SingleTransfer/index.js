import React, { useState, useContext, useCallback, useEffect } from 'react';
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';
import { isMobile } from 'react-device-detect';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import TransferInput from 'components/TransferInput';
import Button from 'components/Button';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import MultilineInput from 'components/MultilineInput';

import { ZkAccountContext, PoolContext } from 'contexts';

import { useFee, useParsedAmount } from 'hooks';

import { formatNumber } from 'utils';
import { useMaxAmountExceeded } from './hooks';

export default () => {
  const {
    zkAccount, balance, transfer, isLoadingState,
    isPending, maxTransferable, minTxAmount,
    verifyShieldedAddress,
  } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const [displayAmount, setDisplayAmount] = useState('');
  const amount = useParsedAmount(displayAmount);
  const [receiver, setReceiver] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { fee, relayerFee, numberOfTxs, isLoadingFee } = useFee(amount, TxType.Transfer);
  const maxAmountExceeded = useMaxAmountExceeded(amount, maxTransferable);

  const onTransfer = useCallback(() => {
    setIsConfirmModalOpen(false);
    setDisplayAmount('');
    setReceiver('');
    transfer(receiver, amount, relayerFee);
  }, [receiver, amount, transfer, relayerFee]);

  const setMax = useCallback(async () => {
    setDisplayAmount(ethers.utils.formatEther(maxTransferable));
  }, [maxTransferable]);

  useEffect(() => {
    async function checkAddress(address) {
      setIsAddressValid(false);
      const isValid = await verifyShieldedAddress(address);
      setIsAddressValid(isValid);
    }
    checkAddress(receiver);
  }, [receiver, verifyShieldedAddress]);

  let button = null;
  if (zkAccount) {
    if (isLoadingState) {
      button = <Button loading contrast disabled>Loading...</Button>;
    } else if (amount.isZero()) {
      button = <Button disabled>Enter amount</Button>;
    } else if (amount.lt(minTxAmount)) {
      button = <Button disabled>Min amount is {formatNumber(minTxAmount)} {currentPool.tokenSymbol}</Button>
    } else if (amount.gt(balance)) {
      button = <Button disabled>Insufficient {currentPool.tokenSymbol} balance</Button>;
    } else if (amount.gt(maxTransferable)) {
      button = <Button disabled>Reduce amount to include {formatNumber(fee)} fee</Button>
    } else if (!receiver) {
      button = <Button disabled>Enter address</Button>;
    } else if (!isAddressValid) {
      button = <Button disabled>Invalid address</Button>;
    } else {
      button = <Button onClick={() => setIsConfirmModalOpen(true)}>Transfer</Button>;
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return isPending ? <PendingAction /> : (
    <>
      <TransferInput
        balance={zkAccount ? balance : null}
        isLoadingBalance={isLoadingState}
        amount={displayAmount}
        onChange={setDisplayAmount}
        shielded={true}
        fee={fee}
        setMax={setMax}
        maxAmountExceeded={maxAmountExceeded}
        isLoadingFee={isLoadingFee}
        currentPool={currentPool}
      />
      <MultilineInput
        placeholder="Enter address of zkBob receiver"
        hint="The address can be generated in the account modal window"
        value={receiver}
        onChange={setReceiver}
        qrCode={isMobile}
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
        isLoadingFee={isLoadingFee}
        numberOfTxs={numberOfTxs}
        type="transfer"
        currentPool={currentPool}
      />
    </>
  );
};
