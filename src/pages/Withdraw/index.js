import React, { useState, useCallback, useContext } from 'react';
// import { useWeb3React } from '@web3-react/core';

import TransferInput from 'containers/TransferInput';
import { ZkAccountContext } from 'contexts';

import Card from 'components/Card';
import Button from 'components/Button';
// import Checkbox from 'components/Checkbox';
import Input from 'components/Input';

const note = 'Amount withdrawn from zero knowledge pool will be deposited to the selected account.';

export default () => {
  const { balance } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState(null);
  const { withdraw } = useContext(ZkAccountContext);
  const handleReceiverChange = useCallback(e => {
    setReceiver(e.target.value);
  }, [setAmount]);
  // const [isXDaiAddress, setIsXDaiAddress] = useState(false);
  // const handleCheckboxClick = useCallback(() => {
  //   setIsXDaiAddress(!isXDaiAddress);
  // }, [isXDaiAddress]);
  return (
    <Card title="Withdraw" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
      {/* <Checkbox label="xDai address of receiver" check={isXDaiAddress} onChange={handleCheckboxClick} /> */}
      {/* {isXDaiAddress && */}
      <Input placeholder="Enter xDai address of receiver" secondary onChange={handleReceiverChange} />
      {/* } */}
      <Button gradient onClick={() => withdraw(receiver, amount)}>Withdraw</Button>
    </Card>
  );
};
