import React, { useState, useContext, useCallback, useEffect } from 'react';
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import TransferInput from 'components/TransferInput';
import Button from 'components/Button';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import MultilineInput from 'components/MultilineInput';

import { ZkAccountContext, PoolContext } from 'contexts';

import { useFee, useParsedAmount, useMaxTransferable } from 'hooks';

import { formatNumber } from 'utils';
import { useMaxAmountExceeded } from './hooks';

export default () => {
  const { t } = useTranslation();
  const {
    zkAccount, balance, transfer, isLoadingState,
    isPending, minTxAmount, verifyShieldedAddress,
  } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const [displayAmount, setDisplayAmount] = useState('');
  const amount = useParsedAmount(displayAmount, currentPool.tokenDecimals);
  const [receiver, setReceiver] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { fee, relayerFee, numberOfTxs, isLoadingFee } = useFee(amount, TxType.Transfer);
  const maxTransferable = useMaxTransferable(TxType.Transfer, relayerFee, amount);
  const maxAmountExceeded = useMaxAmountExceeded(amount, maxTransferable);

  const onTransfer = useCallback(() => {
    setIsConfirmModalOpen(false);
    setDisplayAmount('');
    setReceiver('');
    transfer(receiver, amount, relayerFee);
  }, [receiver, amount, transfer, relayerFee]);

  const setMax = useCallback(async () => {
    setDisplayAmount(ethers.utils.formatUnits(maxTransferable, currentPool.tokenDecimals));
  }, [maxTransferable, currentPool.tokenDecimals]);

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
      button = <Button loading contrast disabled>{t('buttonText.loading')}</Button>;
    } else if (amount.isZero()) {
      button = <Button disabled>{t('buttonText.enterAmount')}</Button>;
    } else if (amount.lt(minTxAmount)) {
      const minAmount = formatNumber(minTxAmount, currentPool.tokenDecimals);
      button = <Button disabled>{t('buttonText.minAmount', { amount: minAmount, symbol: currentPool.tokenSymbol })}</Button>
    } else if (amount.gt(balance)) {
      button = <Button disabled>{t('buttonText.insufficientBalance', { symbol: currentPool.tokenSymbol })}</Button>;
    } else if (amount.gt(maxTransferable)) {
      button = <Button disabled>{t('buttonText.reduceAmount', { fee: formatNumber(fee, currentPool.tokenDecimals)})}</Button>
    } else if (!receiver) {
      button = <Button disabled>{t('buttonText.enterAddress')}</Button>;
    } else if (!isAddressValid) {
      button = <Button disabled>{t('buttonText.invalidAddress')}</Button>;
    } else {
      button = (
        <Button onClick={() => setIsConfirmModalOpen(true)} data-ga-id="initiate-operation-transfer">
          {t('buttonText.transfer')}
        </Button>
      );
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
        gaIdPostfix="transfer"
      />
      <MultilineInput
        placeholder={t('transfer.addressInputPlaceholder')}
        hint={t('transfer.addressInputHint')}
        value={receiver}
        onChange={setReceiver}
        qrCode={isMobile}
      />
      {button}
      <ConfirmTransactionModal
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
