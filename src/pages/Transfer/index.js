import React, { useState } from 'react';

import TransferInput from 'containers/TransferInput';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';

const note = 'This transfer will happen within ZeroPool and will be truly private.';

export default () => {
  const [amount, setAmount] = useState(0);
  return (
    <Card title="Transfer" note={note}>
      <TransferInput amount={amount} setAmount={setAmount} />
      <Input placeholder="Enter ZeroPool address of receiver" />
      <Button gradient>Transfer</Button>
    </Card>
  );
};
