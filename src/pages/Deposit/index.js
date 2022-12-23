import React, { useState, useContext, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import {
  ZkAccountContext, TokenBalanceContext,
  ModalContext, WalletScreeningContext,
} from 'contexts';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import LatestAction from 'components/LatestAction';
import Limits from 'components/Limits';

import { useFee, useParsedAmount, useLatestAction } from 'hooks';
import { useDepositLimit, useMaxAmountExceeded } from './hooks';

import { tokenSymbol } from 'utils/token';
import { formatNumber, minBigNumber } from 'utils';

import { HISTORY_ACTION_TYPES } from 'constants';

const note = `${tokenSymbol()} will be deposited to your account inside the zero knowledge pool.`;

export default () => {
  const { account } = useWeb3React();
  const {
      zkAccount, isLoadingZkAccount, deposit,
      isLoadingState, isPending,
      isLoadingLimits, limits, minTxAmount,
    } = useContext(ZkAccountContext);
  const { balance } = useContext(TokenBalanceContext);
  const { openWalletModal } = useContext(ModalContext);
  const { isSuspiciousAddress } = useContext(WalletScreeningContext);
  const [displayAmount, setDisplayAmount] = useState('');
  const amount = useParsedAmount(displayAmount);
  const latestAction = useLatestAction(HISTORY_ACTION_TYPES.DEPOSIT);
  const { fee } = useFee(amount, TxType.Deposit);
  const depositLimit = useDepositLimit();
  const maxAmountExceeded = useMaxAmountExceeded(amount, balance, fee, depositLimit);

  const onDeposit = useCallback(() => {
    setDisplayAmount('');
    deposit(amount);
  }, [amount, deposit]);

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

  return isPending ? <PendingAction /> : (
    <>
      <Card title="Deposit" note={note}>
        <TransferInput
          balance={balance}
          amount={displayAmount}
          onChange={setDisplayAmount}
          shielded={false}
          fee={fee}
          setMax={setMax}
          maxAmountExceeded={maxAmountExceeded}
        />
        {(() => {
          if (!zkAccount && !isLoadingZkAccount) return <AccountSetUpButton />
          else if (!account) return <Button onClick={openWalletModal}>Connect wallet</Button>
          if (!zkAccount) return <AccountSetUpButton />
          else if (isLoadingState || isLoadingLimits) return <Button $loading $contrast disabled>Updating zero pool state...</Button>
          else if (isSuspiciousAddress) return <Button disabled>Suspicious wallet connected</Button>
          else if (amount.isZero()) return <Button disabled>Enter an amount</Button>
          else if (amount.lt(minTxAmount)) return <Button disabled>Min amount is {formatNumber(minTxAmount)} {tokenSymbol()}</Button>
          else if (amount.gt(balance)) return <Button disabled>Insufficient {tokenSymbol()} balance</Button>
          else if (amount.gt(balance.sub(fee))) return <Button disabled>Reduce amount to include {formatNumber(fee)} fee</Button>
          else if (amount.gt(depositLimit)) return <Button disabled>Amount exceeds daily limit</Button>
          else return <Button onClick={onDeposit}>Deposit</Button>;
        })()}
      </Card>
      <Limits
        limits={[
          { prefix: "Deposit", suffix: "limit per transaction", value: limits.singleDepositLimit },
          { prefix: "Daily deposit", suffix: "limit per address", value: limits.dailyDepositLimitPerAddress },
          { prefix: "Daily deposit", suffix: "limit", value: limits.dailyDepositLimit },
          { prefix: "Pool size", suffix: "limit", value: limits.poolSizeLimit },
        ]}
      />
      {latestAction && (
        <LatestAction
          type="Deposit"
          shielded={false}
          actions={latestAction.actions}
          txHash={latestAction.txHash}
        />
      )}
    </>
  );
};
