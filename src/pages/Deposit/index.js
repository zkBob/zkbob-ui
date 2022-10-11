import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import { ZkAccountContext, TokenBalanceContext, ModalContext } from 'contexts';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import LatestAction from 'components/LatestAction';
import Limits from 'components/Limits';

import { useFee } from 'hooks';
import { useDepositLimit, useMaxAmountExceeded } from './hooks';

import { tokenSymbol } from 'utils/token';
import { formatNumber, minBigNumber } from 'utils';

const note = `${tokenSymbol()} will be deposited to your account inside the zero knowledge pool.`;

export default () => {
  const { account } = useWeb3React();
  const {
      zkAccount, isLoadingZkAccount, deposit,
      isLoadingState, history, isPending,
      isLoadingLimits, limits, minTxAmount,
    } = useContext(ZkAccountContext);
  const { balance } = useContext(TokenBalanceContext);
  const { openWalletModal } = useContext(ModalContext);
  const [amount, setAmount] = useState(ethers.constants.Zero);
  const [displayAmount, setDisplayAmount] = useState('');
  const [latestAction, setLatestAction] = useState(null);
  const { fee } = useFee(amount, TxType.Deposit);
  const depositLimit = useDepositLimit();
  const maxAmountExceeded = useMaxAmountExceeded(amount, balance, fee, depositLimit);

  const onDeposit = useCallback(() => {
    setDisplayAmount('');
    deposit(amount);
  }, [amount, deposit]);

  const setMax = useCallback(async () => {
    let max = ethers.constants.Zero;
    if (balance.gt(fee)) {
      max = minBigNumber(balance.sub(fee), depositLimit);
    }
    setDisplayAmount(ethers.utils.formatEther(max));
  }, [balance, fee, depositLimit]);

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
      latestAction = history.find(item => item.type === 1);
    }
    setLatestAction(latestAction);
  }, [history]);

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
          { name: "Daily deposit", values: limits.dailyDepositLimitPerAddress, perAddress: true },
          { name: "Daily deposit", values: limits.dailyDepositLimit },
          { name: "Pool size", values: limits.poolSizeLimit },
        ]}
      />
      {latestAction && (
        <LatestAction
          type="Deposit"
          shielded={false}
          amount={latestAction.amount}
          txHash={latestAction.txHash}
        />
      )}
    </>
  );
};
