import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { TxType } from 'zkbob-client-js';

import TransferInput from 'containers/TransferInput';
import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import { ZkAccountContext, TokenBalanceContext, ModalContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';
import LatestAction from 'components/LatestAction';
import Limits from 'components/Limits';

import { useFee } from 'hooks';

import { tokenSymbol } from 'utils/token';

const note = `${tokenSymbol()} will be deposited to your account inside the zero knowledge pool.`;

export default () => {
  const { account } = useWeb3React();
  const {
      zkAccount, isLoadingZkAccount, deposit,
      isLoadingState, history, isPending, estimateFee,
      isLoadingLimits, limits,
    } = useContext(ZkAccountContext);
  const { balance } = useContext(TokenBalanceContext);
  const { openWalletModal } = useContext(ModalContext);
  const [amount, setAmount] = useState('');
  const [latestAction, setLatestAction] = useState(null);
  const { fee } = useFee(amount, TxType.Deposit);

  const onDeposit = useCallback(() => {
    setAmount('');
    deposit(amount);
  }, [amount, deposit]);

  const setMax = useCallback(async () => {
    const { fee } = await estimateFee('0', TxType.Deposit);
    const max = balance - fee;
    setAmount(max > 0 ? String(max) : '0');
  }, [balance, estimateFee]);

  useEffect(() => {
    let latestAction = null;
    if (history?.length) {
      latestAction = history.find(item => item.type === 1);
    }
    setLatestAction(latestAction);
  }, [history]);

  const minLimit = Math.min(
    limits.dailyDepositLimitPerAddress.available,
    limits.dailyDepositLimit.available,
    limits.poolSizeLimit.available
  );

  return isPending ? <PendingAction /> : (
    <>
      <Card title="Deposit" note={note}>
        <TransferInput
          balance={balance}
          amount={amount}
          setAmount={setAmount}
          shielded={false}
          fee={fee}
          setMax={setMax}
        />
        {(() => {
          if (!zkAccount && !isLoadingZkAccount) return <AccountSetUpButton />
          else if (!account) return <Button onClick={openWalletModal}>Connect wallet</Button>
          if (!zkAccount) return <AccountSetUpButton />
          else if (isLoadingState || isLoadingLimits) return <Button $loading $contrast disabled>Updating zero pool state...</Button>
          else if (!(amount > 0)) return <Button disabled>Enter an amount</Button>
          else if (amount > balance - fee) return <Button disabled>Insufficient {tokenSymbol()} balance</Button>
          else if (amount > minLimit) return <Button disabled>Limit exceeded</Button>
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
