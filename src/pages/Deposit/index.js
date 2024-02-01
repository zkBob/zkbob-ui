import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';
import { HistoryTransactionType } from 'zkbob-client-js';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import {
  ZkAccountContext, TokenBalanceContext, ModalContext,
  IncreasedLimitsContext, PoolContext, WalletContext,
} from 'contexts';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import ButtonLoading from 'components/ButtonLoading';
import LatestAction from 'components/LatestAction';
import Limits from 'components/Limits';
import DemoCard from 'components/DemoCard';
import IncreasedLimitsBanner from 'components/IncreasedLimitsBanner';
import DefaultLink from 'components/Link';

import { ReactComponent as WargingIcon } from 'assets/warning.svg';

import { useFee, useParsedAmount, useLatestAction, useApproval } from 'hooks';
import { useDepositLimit, useMaxAmountExceeded } from './hooks';

import { formatNumber, minBigNumber } from 'utils';

export default () => {
  const { t } = useTranslation();
  const { address: account } = useContext(WalletContext);
  const {
      zkAccount, isLoadingZkAccount, deposit,
      isLoadingState, isPending, isDemo,
      isLoadingLimits, limits, minTxAmount,
    } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const { balance, nativeBalance, isLoadingBalance } = useContext(TokenBalanceContext);
  const { openWalletModal, openIncreasedLimitsModal } = useContext(ModalContext);
  const { status: increasedLimitsStatus } = useContext(IncreasedLimitsContext);
  const [displayAmount, setDisplayAmount] = useState('');
  const amount = useParsedAmount(displayAmount, currentPool.tokenDecimals);
  const latestAction = useLatestAction(HistoryTransactionType.Deposit);
  const { fee, relayerFee, isLoadingFee, directDepositFee } = useFee(amount, TxType.BridgeDeposit);
  const [isNativeSelected, setIsNativeSelected] = useState(true);
  const isNativeTokenUsed = useMemo(
    () => isNativeSelected && currentPool.isNative,
    [isNativeSelected, currentPool],
  );
  const usedBalance = useMemo(
    () => isNativeTokenUsed ? nativeBalance : balance,
    [isNativeTokenUsed, nativeBalance, balance],
  );
  const usedFee = useMemo(
    () => isNativeTokenUsed ? directDepositFee : fee,
    [isNativeTokenUsed, directDepositFee, fee],
  );
  const { isApproved, approve } = useApproval(currentPool, currentPool.tokenAddress, amount.add(fee), balance, currentPool.depositScheme);
  const depositLimit = useDepositLimit(limits, isNativeTokenUsed);
  const maxAmountExceeded = useMaxAmountExceeded(amount, usedBalance, usedFee, depositLimit);

  const onDeposit = useCallback(() => {
    setDisplayAmount('');
    deposit(amount, relayerFee, isNativeTokenUsed);
  }, [amount, deposit, relayerFee, isNativeTokenUsed]);

  const setMax = useCallback(async () => {
    try {
      let max = ethers.constants.Zero;
      if (usedBalance.gt(usedFee)) {
        max = minBigNumber(usedBalance.sub(usedFee), depositLimit);
      }
      setDisplayAmount(ethers.utils.formatUnits(max, currentPool.tokenDecimals));
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Deposit.setMax' } });
    }
  }, [usedFee, depositLimit, usedBalance, currentPool.tokenDecimals]);

  useEffect(() => {
    setDisplayAmount('');
  }, [currentPool.alias]);

  if (isDemo) return <DemoCard />;

  return isPending ? <PendingAction /> : (
    <>
      <Card
        title={t('deposit.title')}
        note={t('deposit.note', { symbol: currentPool.tokenSymbol })}
      >
        <TransferInput
          balance={account ? balance : null}
          nativeBalance={account ? nativeBalance : null}
          isLoadingBalance={isLoadingBalance}
          amount={displayAmount}
          onChange={setDisplayAmount}
          shielded={false}
          fee={usedFee}
          isLoadingFee={isLoadingFee}
          setMax={setMax}
          maxAmountExceeded={maxAmountExceeded}
          currentPool={currentPool}
          isNativeSelected={isNativeSelected}
          setIsNativeSelected={setIsNativeSelected}
          isNativeTokenUsed={isNativeTokenUsed}
          gaIdPostfix="deposit"
        />
        {(() => {
          if (!zkAccount && !isLoadingZkAccount) {
            return <AccountSetUpButton />;
          }
          else if (!account) {
            return <Button onClick={openWalletModal}>{t('buttonText.connectWallet')}</Button>;
          }
          else if (!zkAccount) {
            return <AccountSetUpButton />;
          }
          else if (isLoadingState || isLoadingLimits) {
            return <ButtonLoading />;
          }
          else if (amount.isZero()) {
            return <Button disabled>{t('buttonText.enterAmount')}</Button>;
          }
          else if (amount.lt(minTxAmount)) {
            const minAmount = formatNumber(minTxAmount, currentPool.tokenDecimals);
            return <Button disabled>{t('buttonText.minAmount', { amount: minAmount, symbol: currentPool.tokenSymbol })}</Button>;
          }
          else if (amount.gt(usedBalance)) {
            return <Button disabled>{t('buttonText.insufficientBalance', { symbol: currentPool.tokenSymbol })}</Button>;
          }
          else if (amount.gt(usedBalance.sub(usedFee))) {
            return <Button disabled>{t('buttonText.reduceAmount', { fee: formatNumber(usedFee, currentPool.tokenDecimals)})}</Button>;
          }
          else if (amount.gt(depositLimit)) {
            return <Button disabled>{t('buttonText.amountExceedsLimit')}</Button>;
          }
          else if (['permit2', 'approve'].includes(currentPool.depositScheme) && !isNativeTokenUsed && !isApproved) {
            return <Button onClick={approve}>{t('buttonText.approveTokens')}</Button>;
          }
          else {
            return <Button onClick={onDeposit} data-ga-id="initiate-operation-deposit">{t('buttonText.deposit')}</Button>;
          }
        })()}
        {isNativeTokenUsed && (
          <MessageContainer>
            <WargingIcon/>
            <span style={{ margin: '0 4px 0 8px' }}>
              {t('deposit.ddNote', { symbol: currentPool.tokenSymbol })}
            </span>
            <Link href="https://docs.zkbob.com/zkbob-overview/zkbob-pools/eth-pool-on-optimism">{t('common.learnMore')}</Link>
          </MessageContainer>
        )}
      </Card>
      {(increasedLimitsStatus && !!currentPool.kycUrls) &&
        <IncreasedLimitsBanner
          status={increasedLimitsStatus}
          openModal={openIncreasedLimitsModal}
          account={account}
          kycUrls={currentPool.kycUrls}
        />
      }
      <Limits
        loading={isLoadingLimits}
        limits={[
          {
            name: <Trans i18nKey="limits.deposit.perTransaction" />,
            value: limits[isNativeTokenUsed ? 'singleDirectDepositLimit' : 'singleDepositLimit'],
          },
          {
            name: <Trans i18nKey="limits.deposit.dailyPerAddress" />,
            value: limits[isNativeTokenUsed ? 'dailyDirectDepositLimitPerAddress' : 'dailyDepositLimitPerAddress'],
          },
          { name: <Trans i18nKey="limits.deposit.daily" />, value: limits.dailyDepositLimit },
          { name: <Trans i18nKey="limits.poolSize" />, value: limits.poolSizeLimit },
        ]}
        currentPool={currentPool}
      />
      {latestAction && (
        <LatestAction
          type="deposit"
          shielded={false}
          data={latestAction}
          currentPool={currentPool}
        />
      )}
    </>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const MessageContainer = styled(Row)`
  justify-content: center;
  flex-wrap: wrap;
  background: #FBEED0;
  border-radius: 10px;
  padding: 7px 10px;
  font-size: 14px;
  font-weight: ${props => props.theme.text.weight.bold};
  color: ${props => props.theme.text.color.secondary};
`;

const Link = styled(DefaultLink)`
  font-weight: ${props => props.theme.text.weight.bold};
`;
