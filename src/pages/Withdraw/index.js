import React, { useState, useCallback, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';

import TransferInput from 'containers/TransferInput';
import { ZkAccountContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';

const note = 'Amount withdrawn from zero knowledge pool will be deposited to the selected account.';

export default () => {
  const [amount, setAmount] = useState(0);
  const { account } = useWeb3React();
  const { withdraw } = useContext(ZkAccountContext);
  const [isXDaiAddress, setIsXDaiAddress] = useState(false);
  const handleCheckboxClick = useCallback(() => {
    setIsXDaiAddress(!isXDaiAddress);
  }, [isXDaiAddress]);
  return (
    <Card title="Withdraw" note={note}>
      <TransferInput amount={amount} setAmount={setAmount} />
      <Checkbox label="xDai address of receiver" check={isXDaiAddress} onChange={handleCheckboxClick} />
      {isXDaiAddress &&
        <Input placeholder="Enter xDai address of receiver" secondary />
      }
      <Button gradient onClick={() => withdraw(account, amount)}>Withdraw</Button>
    </Card>
  );
};
