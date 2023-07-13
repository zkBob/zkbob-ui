import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi'
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';
import { HistoryTransactionType } from 'zkbob-client-js';
import styled from 'styled-components';

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
import DefaultLink from 'components/Link';

import { ReactComponent as WargingIcon } from 'assets/warning.svg';

import { useFee, useParsedAmount, useLatestAction } from 'hooks';
import { useDepositLimit, useMaxAmountExceeded, useApproval } from './hooks';

import { formatNumber, minBigNumber } from 'utils';

export default () => {
  const { address: account } = useAccount();
  const {
      zkAccount, isLoadingZkAccount, deposit,
      isLoadingState, isPending, isDemo,
      isLoadingLimits, limits, minTxAmount,
    } = useContext(ZkAccountContext);
  const { balance, nativeBalance, isLoadingBalance } = useContext(TokenBalanceContext);
  const { openWalletModal, openIncreasedLimitsModal } = useContext(ModalContext);
  const { status: increasedLimitsStatus } = useContext(IncreasedLimitsContext);
  const [displayAmount, setDisplayAmount] = useState('');
  const amount = useParsedAmount(displayAmount);
  const latestAction = useLatestAction(HistoryTransactionType.Deposit);
  const { fee, relayerFee, isLoadingFee, directDepositFee } = useFee(amount, TxType.BridgeDeposit);
  const { currentPool } = useContext(PoolContext);
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
  const { isApproved, approve } = useApproval(amount.add(fee), balance);
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
      setDisplayAmount(ethers.utils.formatEther(max));
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Deposit.setMax' } });
    }
  }, [usedFee, depositLimit, usedBalance]);

  if (isDemo) return <DemoCard />;

  return isPending ? <PendingAction /> : (
    <>
      <Card
        title="Deposit"
        note={`${currentPool.tokenSymbol} will be deposited to your zkAccount. Once received, you can transfer ${currentPool.tokenSymbol} privately.`}
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
        />
        {(() => {
          if (!zkAccount && !isLoadingZkAccount) return <AccountSetUpButton />
          else if (!account) return <Button onClick={openWalletModal}>Connect wallet</Button>
          if (!zkAccount) return <AccountSetUpButton />
          else if (isLoadingState || isLoadingLimits) return <Button loading contrast disabled>Loading...</Button>
          else if (amount.isZero()) return <Button disabled>Enter amount</Button>
          else if (amount.lt(minTxAmount)) return <Button disabled>Min amount is {formatNumber(minTxAmount)} {currentPool.tokenSymbol}</Button>
          else if (amount.gt(usedBalance)) return <Button disabled>Insufficient {currentPool.tokenSymbol} balance</Button>
          else if (amount.gt(usedBalance.sub(usedFee))) return <Button disabled>Reduce amount to include {formatNumber(usedFee)} fee</Button>
          else if (amount.gt(depositLimit)) return <Button disabled>Amount exceeds daily limit</Button>
          else if (currentPool.isNative && !isNativeSelected && !isApproved) return <Button onClick={approve}>Approve tokens</Button>
          else return <Button onClick={onDeposit}>Deposit</Button>;
        })()}
        {isNativeTokenUsed && (
          <MessageContainer>
            <WargingIcon/>
            <span style={{ margin: '0 4px 0 8px' }}>
              {currentPool.tokenSymbol} depositing can take up to 10 minutes.
            </span>
            <Link href="https://docs.zkbob.com/zkbob-overview/zkbob-pools/eth-pool-on-optimism">Learn more</Link>
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
            prefix: "Deposit",
            suffix: "limit per transaction",
            value: limits[isNativeTokenUsed ? 'singleDirectDepositLimit' : 'singleDepositLimit'],
          },
          {
            prefix: "Daily deposit",
            suffix: "limit per address",
            value: limits[isNativeTokenUsed ? 'dailyDirectDepositLimitPerAddress' : 'dailyDepositLimitPerAddress'],
          },
          { prefix: "Daily deposit", suffix: "limit", value: limits.dailyDepositLimit },
          { prefix: "Pool size", suffix: "limit", value: limits.poolSizeLimit },
        ]}
        currentPool={currentPool}
      />
      {latestAction && (
        <LatestAction
          type="Deposit"
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
