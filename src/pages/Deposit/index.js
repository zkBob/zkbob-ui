import React, { useState, useContext, useCallback } from 'react';
import { useAccount } from 'wagmi'
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';
import { HistoryTransactionType } from 'zkbob-client-js';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import { ZkAccountContext, TokenBalanceContext, ModalContext, IncreasedLimitsContext, PoolContext } from 'contexts';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import LatestAction from 'components/LatestAction';
import Limits from 'components/Limits';
import DemoCard from 'components/DemoCard';
import IncreasedLimitsBanner from 'components/IncreasedLimitsBanner';

import { useFee, useParsedAmount, useLatestAction } from 'hooks';
import { useDepositLimit, useMaxAmountExceeded } from './hooks';

import { formatNumber, minBigNumber } from 'utils';

export default () => {
  const { address: account } = useAccount();
  const {
      zkAccount, isLoadingZkAccount, deposit,
      isLoadingState, isPending, isDemo,
      isLoadingLimits, limits, minTxAmount,
    } = useContext(ZkAccountContext);
  const { balance, isLoadingBalance } = useContext(TokenBalanceContext);
  const { openWalletModal, openIncreasedLimitsModal } = useContext(ModalContext);
  const { status: increasedLimitsStatus } = useContext(IncreasedLimitsContext);
  const [displayAmount, setDisplayAmount] = useState('');
  const amount = useParsedAmount(displayAmount);
  const latestAction = useLatestAction(HistoryTransactionType.Deposit);
  const { fee, relayerFee, isLoadingFee } = useFee(amount, TxType.Deposit);
  const depositLimit = useDepositLimit();
  const maxAmountExceeded = useMaxAmountExceeded(amount, balance, fee, depositLimit);
  const { currentPool } = useContext(PoolContext);

  const onDeposit = useCallback(() => {
    setDisplayAmount('');
    deposit(amount, relayerFee);
  }, [amount, deposit, relayerFee]);

  const setMax = useCallback(async () => {
    try {
      let max = ethers.constants.Zero;
      if (balance.gt(fee)) {
        max = minBigNumber(balance.sub(fee), depositLimit);
      }
      setDisplayAmount(ethers.utils.formatEther(max));
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Deposit.setMax' } });
    }
  }, [balance, fee, depositLimit]);

  if (isDemo) return <DemoCard />;

  return isPending ? <PendingAction /> : (
    <>
      <Card
        title="Deposit"
        note={`${currentPool.tokenSymbol} will be deposited to your zkAccount. Once received, you can transfer ${currentPool.tokenSymbol} privately.`}
      >
        <TransferInput
          balance={account ? balance : null}
          isLoadingBalance={isLoadingBalance}
          amount={displayAmount}
          onChange={setDisplayAmount}
          shielded={false}
          fee={fee}
          isLoadingFee={isLoadingFee}
          setMax={setMax}
          maxAmountExceeded={maxAmountExceeded}
          currentPool={currentPool}
        />
        {(() => {
          if (!zkAccount && !isLoadingZkAccount) return <AccountSetUpButton />
          else if (!account) return <Button onClick={openWalletModal}>Connect wallet</Button>
          if (!zkAccount) return <AccountSetUpButton />
          else if (isLoadingState || isLoadingLimits) return <Button loading contrast disabled>Loading...</Button>
          else if (amount.isZero()) return <Button disabled>Enter amount</Button>
          else if (amount.lt(minTxAmount)) return <Button disabled>Min amount is {formatNumber(minTxAmount)} {currentPool.tokenSymbol}</Button>
          else if (amount.gt(balance)) return <Button disabled>Insufficient {currentPool.tokenSymbol} balance</Button>
          else if (amount.gt(balance.sub(fee))) return <Button disabled>Reduce amount to include {formatNumber(fee)} fee</Button>
          else if (amount.gt(depositLimit)) return <Button disabled>Amount exceeds daily limit</Button>
          else return <Button onClick={onDeposit}>Deposit</Button>;
        })()}
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
          { prefix: "Deposit", suffix: "limit per transaction", value: limits.singleDepositLimit },
          { prefix: "Daily deposit", suffix: "limit per address", value: limits.dailyDepositLimitPerAddress },
          { prefix: "Daily deposit", suffix: "limit", value: limits.dailyDepositLimit },
          { prefix: "Pool size", suffix: "limit", value: limits.poolSizeLimit },
        ]}
        currentPool={currentPool}
      />
      {latestAction && (
        <LatestAction
          type="Deposit"
          shielded={false}
          actions={latestAction.actions}
          txHash={latestAction.txHash}
          currentPool={currentPool}
        />
      )}
    </>
  );
};
