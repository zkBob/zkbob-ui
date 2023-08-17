import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { TxType } from 'zkbob-client-js';
import { HistoryTransactionType } from 'zkbob-client-js';
import styled from 'styled-components';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import { ZkAccountContext, PoolContext } from 'contexts';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import MultilineInput from 'components/MultilineInput';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import LatestAction from 'components/LatestAction';
import Limits from 'components/Limits';
import DemoCard from 'components/DemoCard';
import ConvertOptions from 'components/ConvertOptions';

import { useFee, useParsedAmount, useLatestAction, useMaxTransferable } from 'hooks';

import { formatNumber, minBigNumber } from 'utils';

import { NETWORKS } from 'constants';
import { useMaxAmountExceeded, useConvertion } from './hooks';

export default () => {
  const {
    zkAccount, balance, withdraw, isLoadingState,
    isPending, isDemo, limits, isLoadingLimits, minTxAmount,
  } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const [displayAmount, setDisplayAmount] = useState('');
  const amount = useParsedAmount(displayAmount, currentPool.tokenDecimals);
  const [receiver, setReceiver] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [amountToConvert, setAmountToConvert] = useState(ethers.constants.Zero);
  const latestAction = useLatestAction(HistoryTransactionType.Withdrawal);
  const { fee, relayerFee, numberOfTxs, isLoadingFee } = useFee(amount, TxType.Withdraw, amountToConvert);
  const maxWithdrawable = useMaxTransferable(TxType.Withdraw, relayerFee, amountToConvert);
  const maxAmountExceeded = useMaxAmountExceeded(amount, maxWithdrawable, limits.dailyWithdrawalLimit?.available);
  const convertionDetails = useConvertion(currentPool);

  const onWihdrawal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setDisplayAmount('');
    setReceiver('');
    const _amountToConvert = currentPool.isNative ? amount : amountToConvert;
    withdraw(receiver, amount, _amountToConvert, relayerFee);
  }, [receiver, amount, amountToConvert, withdraw, relayerFee, currentPool]);

  const setMax = useCallback(async () => {
    const max = minBigNumber(maxWithdrawable, limits.dailyWithdrawalLimit.available);
    setDisplayAmount(ethers.utils.formatUnits(max, currentPool.tokenDecimals));
  }, [maxWithdrawable, limits, currentPool.tokenDecimals]);

  useEffect(() => {
    setAmountToConvert(ethers.constants.Zero);
  }, [currentPool]);

  if (isDemo) return <DemoCard />;

  let button = null;
  if (zkAccount) {
    if (isLoadingState || isLoadingLimits) {
      button = <Button loading contrast disabled>Loading...</Button>;
    } else if (amount.isZero()) {
      button = <Button disabled>Enter amount</Button>;
    } else if (amount.lt(minTxAmount)) {
      button = <Button disabled>Min amount is {formatNumber(minTxAmount, currentPool.tokenDecimals)} {currentPool.tokenSymbol}</Button>
    } else if (amount.gt(balance)) {
      button = <Button disabled>Insufficient {currentPool.tokenSymbol} balance</Button>;
    } else if (amount.gt(maxWithdrawable)) {
      button = <Button disabled>Reduce amount to include {formatNumber(fee, currentPool.tokenDecimals)} fee</Button>;
    } else if (amount.gt(limits.dailyWithdrawalLimit.available)) {
      button = <Button disabled>Amount exceeds daily limit</Button>;
    } else if (!receiver) {
      button = <Button disabled>Enter address</Button>;
    } else if (!ethers.utils.isAddress(receiver)) {
      button = <Button disabled>Invalid address</Button>;
    } else {
      button = <Button onClick={() => setIsConfirmModalOpen(true)} data-ga-id="initiate-operation-withdraw">Withdraw</Button>;
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return isPending ? <PendingAction /> : (
    <>
      <Card
        title="Withdraw"
        note={`${currentPool.tokenSymbol} will be withdrawn from zkBob and deposited into the provided wallet address.`}
      >
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
          gaIdPostfix="withdraw"
        />
        {convertionDetails.exist && (
          <ConvertOptions
            amountToConvert={amountToConvert}
            setAmountToConvert={setAmountToConvert}
            amountToWithdraw={amount}
            maxAmountToWithdraw={maxWithdrawable}
            details={convertionDetails}
            currentPool={currentPool}
          />
        )}
        <MultilineInput
          placeholder={`Enter ${NETWORKS[currentPool.chainId].name} address of receiver`}
          secondary
          value={receiver}
          onChange={setReceiver}
        />
        {!amountToConvert.isZero() && (
          <Text>
            You will get <b>{formatNumber(amount.sub(amountToConvert), currentPool.tokenDecimals)} {currentPool.tokenSymbol}</b> and{' '}
            <b>
              ~ {formatNumber(
                  amountToConvert.mul(convertionDetails.price).div(ethers.utils.parseUnits('1', convertionDetails.decimals)),
                  currentPool.tokenDecimals
                )}{' '}
              {convertionDetails.toTokenSymbol}
            </b>
          </Text>
        )}
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
          isLoadingFee={isLoadingFee}
          numberOfTxs={numberOfTxs}
          type="withdrawal"
          amountToConvert={amountToConvert}
          convertionDetails={convertionDetails}
          currentPool={currentPool}
        />
      </Card>
      <Limits
        loading={isLoadingLimits}
        limits={[
          { prefix: "Daily withdrawal", suffix: "limit", value: limits.dailyWithdrawalLimit },
        ]}
        currentPool={currentPool}
      />
      {latestAction && (
        <LatestAction
          type="Withdrawal"
          shielded={true}
          data={latestAction}
          currentPool={currentPool}
        />
      )}
    </>
  );
};

const Text = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.text.color.primary};
  text-align: center;
  & > b {
    font-weight: 600;
  }
`;
