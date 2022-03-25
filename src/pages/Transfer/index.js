import React, { useState, useContext } from 'react';

import TransferInput from 'containers/TransferInput';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';

import { ZkAccountContext } from 'contexts';

const note = 'This transfer will happen within ZeroPool and will be truly private.';

export default () => {
  const { balance } = useContext(ZkAccountContext);
  const [amount, setAmount] = useState(0);
  return (
    <Card title="Transfer" note={note}>
      <TransferInput balance={balance} amount={amount} setAmount={setAmount} isPoolToken={true} />
      <Input placeholder="Enter ZeroPool address of receiver" />
      <Button gradient>Transfer</Button>
    </Card>
  );
};
