import React, { useState, useCallback } from 'react';

import TransferInput from 'containers/TransferInput';

import Card from 'components/Card';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';

const note = 'Amount withdrawn from zero knowledge pool will be deposited to the selected account.';

export default () => {
  const [isXDaiAddress, setIsXDaiAddress] = useState(false);
  const handleCheckboxClick = useCallback(() => {
    setIsXDaiAddress(!isXDaiAddress);
  }, [isXDaiAddress]);
  return (
    <Card title="Withdraw" note={note}>
      <TransferInput />
      <Checkbox label="xDai address of receiver" check={isXDaiAddress} onChange={handleCheckboxClick} />
      {isXDaiAddress &&
        <Input placeholder="Enter xDai address of receiver" secondary />
      }
      <Button gradient>Withdraw</Button>
    </Card>
  );
};
