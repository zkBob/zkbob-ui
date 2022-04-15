import React, { useState, useContext, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

import TransferInput from 'containers/TransferInput';
import AccountSetUpButton from 'containers/AccountSetUpButton';

import { ZkAccountContext, TokenBalanceContext, WalletModalContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';

const note = 'DAI from your account will be deposited to your ZeroPool address via relayer.';

export default () => {
  const { account } = useWeb3React();
  const { zkAccount, deposit, isLoadingState } = useContext(ZkAccountContext);
  const { balance } = useContext(TokenBalanceContext);
  const { openWalletModal } = useContext(WalletModalContext);
  const [amount, setAmount] = useState(0);
  const onDeposit = useCallback(() => {
    setAmount(0);
    deposit(amount);
  }, [amount, deposit]);
  return (
    <Card title="Deposit" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={false} />
      {(() => {
        if (!zkAccount) return <AccountSetUpButton />
        else if (!account) return <Button onClick={openWalletModal}>Connect wallet</Button>
        else if (isLoadingState) return <Button loading disabled>Loading zero pool state...</Button>
        else if (!(amount > 0)) return <Button disabled>Enter an amount</Button>
        else if (amount > balance) return <Button disabled>Insufficient DAI balance</Button>
        else return <Button onClick={onDeposit}>Deposit</Button>;
      })()}
    </Card>
  );
};
