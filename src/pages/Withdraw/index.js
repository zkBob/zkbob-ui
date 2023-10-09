import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { TxType } from 'zkbob-client-js';
import { HistoryTransactionType } from 'zkbob-client-js';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import { ZkAccountContext, PoolContext, WalletContext } from 'contexts';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import ButtonLoading from 'components/ButtonLoading';
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
  const { t } = useTranslation();
  const {
    zkAccount, balance, withdraw, isLoadingState,
    isPending, isDemo, limits, isLoadingLimits, minTxAmount,
  } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const { isAddress } = useContext(WalletContext);
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
      button = <ButtonLoading />;
    } else if (amount.isZero()) {
      button = <Button disabled>{t('buttonText.enterAmount')}</Button>;
    } else if (amount.lt(minTxAmount)) {
      const minAmount = formatNumber(minTxAmount, currentPool.tokenDecimals);
      button = <Button disabled>{t('buttonText.minAmount', { amount: minAmount, symbol: currentPool.tokenSymbol })}</Button>
    } else if (amount.gt(balance)) {
      button = <Button disabled>{t('buttonText.insufficientBalance', { symbol: currentPool.tokenSymbol })}</Button>;
    } else if (amount.gt(maxWithdrawable)) {
      button = <Button disabled>{t('buttonText.reduceAmount', { fee: formatNumber(fee, currentPool.tokenDecimals)})}</Button>;
    } else if (amount.gt(limits.dailyWithdrawalLimit.available)) {
      button = <Button disabled>{t('buttonText.amountExceedsLimit')}</Button>;
    } else if (!receiver) {
      button = <Button disabled>{t('buttonText.enterAddress')}</Button>;
    } else if (!isAddress(receiver)) {
      button = <Button disabled>{t('buttonText.invalidAddress')}</Button>;
    } else {
      button = (
        <Button onClick={() => setIsConfirmModalOpen(true)} data-ga-id="initiate-operation-withdraw">
          {t('buttonText.withdraw')}
        </Button>
      );
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return isPending ? <PendingAction /> : (
    <>
      <Card
        title={t('withdraw.title')}
        note={t('withdraw.note', { symbol: currentPool.tokenSymbol })}
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
          placeholder={t('withdraw.addressInputPlaceholder', { network: NETWORKS[currentPool.chainId].name })}
          secondary
          value={receiver}
          onChange={setReceiver}
        />
        {!amountToConvert.isZero() && (
          <Text>
            <Trans
              i18nKey="withdraw.convertionDetails"
              values={{
                amount1: formatNumber(amount.sub(amountToConvert), currentPool.tokenDecimals),
                symbol1: currentPool.tokenSymbol,
                amount2: formatNumber(
                  amountToConvert.mul(convertionDetails.price).div(ethers.utils.parseUnits('1', convertionDetails.decimals)),
                  currentPool.tokenDecimals
                ),
                symbol2: convertionDetails.toTokenSymbol,
              }}
            />
          </Text>
        )}
        {button}
        <ConfirmTransactionModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={onWihdrawal}
          amount={amount}
          receiver={receiver}
          shielded={true}
          fee={fee}
          isLoadingFee={isLoadingFee}
          numberOfTxs={numberOfTxs}
          type="withdraw"
          amountToConvert={amountToConvert}
          convertionDetails={convertionDetails}
          currentPool={currentPool}
        />
      </Card>
      <Limits
        loading={isLoadingLimits}
        limits={[{
          name: <Trans i18nKey="limits.withdraw.daily" />,
          value: limits.dailyWithdrawalLimit,
        }]}
        currentPool={currentPool}
      />
      {latestAction && (
        <LatestAction
          type="withdraw"
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
  & > b, & > strong {
    font-weight: 600;
  }
`;
